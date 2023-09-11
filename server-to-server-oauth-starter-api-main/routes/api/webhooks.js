const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const ZoomUser = require("../../models/ZoomUser");

router.post("/meeting-ended", async (req, res) => {
  try {
    let response;
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
        res.status(response.status);
        res.json(response.message);
      } else if (event === "meeting.ended") {
        console.log("ENDED_EVENT", event);

        const host_id = req.body.payload.object.host_id;
        // Find the user by their Zoom Account ID and decrement sessions
        const user = await ZoomUser.findOne({ zoomAccountId: host_id });
        if (user) {
          if (user.sessions > 0) {
            await ZoomUser.findOneAndUpdate(
              { zoomAccountId: host_id },
              { $inc: { sessions: -1 } },
              { new: true } // This option returns the modified document
            );
            console.log("Successfully updated user:", user.name);
          } else {
            console.log(
              "Sessions already at zero, not decrementing:",
              user.name
            );
          }
        } else {
          console.log("User not found:", host_id);
        }
        // const user = await ZoomUser.findOneAndUpdate(
        //   { zoomAccountId: host_id },
        //   { $inc: { sessions: -1 } },
        //   { new: true } // This option returns the modified document
        // );
        // if (user) {
        //   console.log("Successfully updated user:", user.name);
        // } else {
        //   console.log("User not found:", host_id);
        // }
        // Respond to Zoom
        response = {
          message: "Successfully processed webhook",
          status: 200,
        };
        res.status(response.status);
        res.json(response);
      } else if (event === "meeting.started") {
        console.log("STARTED_EVENT", event);

        const host_id = req.body.payload.object.host_id;
        // Find the user by their Zoom Account ID and decrement sessions
        const user = await ZoomUser.findOneAndUpdate(
          { zoomAccountId: host_id },
          { $inc: { sessions: +1 } },
          { new: true } // This option returns the modified document
        );
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
        status: 401,
      };
      res.status(response.status);
      res.json(response);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
