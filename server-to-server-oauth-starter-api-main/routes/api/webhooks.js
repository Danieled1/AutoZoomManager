const express = require("express");
const router = express.Router();

router.post("/meeting-ended", async (req, res) => {
  const zoomToken = req.headerConfig["Authorization"]; // This is a hypothetical header. Check Zoom's documentation for the exact header name.

  // // Verify the token
  // if (zoomToken !== process.env.ZOOM_VERIFICATION_TOKEN) {
  //   return res.status(401).send("Unauthorized request");
  // }
  console.log(req.body);
  const { payload } = req.body;
  const meetingId = payload.object.id;

  // Now find the user with this meeting ID and update their record.
  // ...

  res.status(200).send();
});

module.exports = router;
