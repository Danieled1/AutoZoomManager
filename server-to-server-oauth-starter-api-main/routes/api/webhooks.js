const express = require("express");
const router = express.Router();
const crypto = require("crypto");
router.post("/meeting-ended", async (req, res) => {
  try {
    console.log("Received request:", req.body);

    if (!process.env.ZOOM_SECRET_TOKEN) {
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

    if (req.headers["x-zm-signature"] !== signature) {
      return res.status(401).send("Unauthorized request");
    }

    if (event === "endpoint.url_validation") {
      const hashForValidate = crypto
        .createHmac("sha256", process.env.ZOOM_SECRET_TOKEN)
        .update(payload.plainToken)
        .digest("hex");

      res.status(200).json({
        message: {
          plainToken: payload.plainToken,
          encryptedToken: hashForValidate,
        },
      });
    } else {
      res.status(401).json({
        message: "Unauthorized request to Zoom Webhook",
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
