const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const ZoomUser = require("../../models/ZoomUser");

router.post("/meeting-ended", async (req, res) => {
  try {
    let response;
    console.log("Received request body:", req.body);
    console.log("Received request headers:", req.headers);

    if (!process.env.ZOOM_SECRET_TOKEN) {
      console.log(
        "Server configuration error: ZOOM_WEBHOOK_SECRET_TOKEN not set."
      );
      return res
        .status(500)
        .send("Server configuration error: ZOOM_WEBHOOK_SECRET_TOKEN not set.");
    }

    const { event, payload } = req.body;
    const message = `v0:${
      req.headers["x-zm-request-timestamp"]
    }:${JSON.stringify(req.body)}`;

    const hashForVerify = crypto
      .createHmac("sha256", process.env.ZOOM_SECRET_TOKEN)
      .update(message)
      .digest("hex");

    const signature = `v0=${hashForVerify}`;

    console.log("Expected Signature:", signature);
    console.log("Received Signature:", req.headers["x-zm-signature"]);

    if (signature === req.headers["x-zm-signature"]) {
      if (event === "endpoint.url_validation") {
        const hashForValidate = crypto
          .createHmac("sha256", process.env.ZOOM_SECRET_TOKEN)
          .update(payload.plainToken)
          .digest("hex");
        response = {
          message: {
            plainToken: payload.plainToken,
            encryptedToken: hashForValidate,
          },
          status: 200,
        };
        console.log("Challange response:", response.message);
        res.status(response.status);
        res.json(response.message);
      } else if (event === "meeting.ended") {
        console.log(event, "EVENT");
        const { host_id } = req.body.object.host_id; // Extracting the host ID
        console.log(host_id, "HOST ID");
        // Find the user by their Zoom Account ID and decrement sessions
        const user = await ZoomUser.findOneAndUpdate(
          { zoomAccountId: host_id },
          { $inc: { sessions: -1 } },
          { new: true } // This option returns the modified document
        );
        console.log(user, "ZoomUser");
        if (user) {
          console.log("Successfully updated user:", user.name);
        } else {
          console.log("User not found:", host_id);
        }

        // Respond to Zoom
        response = {
          message: "Successfully processed webhook",
          status: 200,
        };
        res.status(response.status);
        res.json(response);
      } else {
        console.log("Authorized request to Zoom Webhook not validation");
        response = {
          message: "Authorized request to Zoom Webhook not validation",
          status: 200,
        };
        res.status(response.status);
        res.json(response);
      }
    } else {
      console.log("Unauthorized request to Zoom Webhook not equal");
      response = {
        message: "Unauthorized request to Zoom Webhook not equal sign",
        status: 200,
      };
      res.status(response.status);
      res.json(response);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
