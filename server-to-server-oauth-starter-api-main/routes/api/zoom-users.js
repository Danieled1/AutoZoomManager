const express = require("express");
const ZoomUser = require("../../models/ZoomUser");

const router = express.Router();
// Get eligible Users
router.get("/eligible", async (req, res) => {
  try {
    const eligibleZoomUsers = await ZoomUser.find({ sessions: { $lt: 2 } });
    if (!eligibleZoomUsers || eligibleZoomUsers.length === 0) {
      return res
        .status(204)
        .json({ message: "No free users left to open a meeting with." });
    }
    return res.status(200).send({ eligibleZoomUsers });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching eligible users.", error: err.message });
  }
});
// Add User
router.post("/add", async (req, res) => {
  const { body } = req;
  const newZoomUser = new ZoomUser(body);
  try {
    await newZoomUser.save();
    return res.status(201).send({ success: true, ZoomUser: newZoomUser });
  } catch (error) {
    return res.status(500).json({
      message: `Error with adding a new zoom-user`,
      error: error.message,
    });
  }
});
// Get Users
router.get("/", async (req, res) => {
  try {
    const zoomUsers = await ZoomUser.find();
    return res.status(201).send({ success: true, ZoomUsers: zoomUsers });
  } catch (err) {
    return res.status(500).json({
      message: `Error with getting the zoom-user`,
      error: err.message,
    });
  }
});
// Get User
router.get("/:id", async (req, res) => {
  // The id of the document not the zoomAccountId
  const { id } = req.params;
  try {
    const zoomUser = await ZoomUser.findById(id);
    return res.status(201).send({ success: true, ZoomUser: zoomUser });
  } catch (err) {
    if (err.kind === "ObjectId" && err.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID." });
    }
    return res.status(500).json({
      message: `Error with getting the zoom-user`,
      error: err.message,
    });
  }
});
// Edit User
router.patch("/:id", async (req, res) => {
  // The id of the document not the zoomAccountId
  const { id } = req.params;
  const { body } = req;
  try {
    const zoomUser = await ZoomUser.findById(id);

    if (!zoomUser) {
      return res.status(404).json({ message: "User not found." });
    }
    Object.assign(zoomUser, body);

    await zoomUser.save();
    return res
      .status(201)
      .send({ success: true, message: `${zoomUser.name} is Updated` });
  } catch (err) {
    if (err.kind === "ObjectId" && err.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID." });
    }
    return res
      .status(500)
      .json({ message: "Error updating user.", error: err.message });
  }
});
// Delete User
router.delete("/delete/:zoomAccountId", async (req, res) => {
  const { zoomAccountId } = req.params;
  try {
    const result = await ZoomUser.deleteOne({ zoomAccountId });
    
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "User Not Found." });

    return res.status(200).json({ message: `User successfully deleted.` });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting the user.",
      error: error.message,
    });
  }
});
module.exports = router;
