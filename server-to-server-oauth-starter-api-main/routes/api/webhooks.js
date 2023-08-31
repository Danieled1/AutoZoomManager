const express = require("express");
const router = express.Router();
const crypto = require("crypto");
router.post("/meeting-ended", async (req, res) => {
  const { event, payload, event_ts } = req.body;

  // For Challenge-Response Check (CRC)
  if (event === "endpoint.url_validation") {
    const hashForValidate = crypto
      .createHmac("sha256", process.env.ZOOM_WEBHOOK_SECRET_TOKEN)
      .update(payload.plainToken)
      .digest("hex");

    return res.status(200).json({
      plainToken: payload.plainToken,
      encryptedToken: hashForValidate,
    });
  }

  // For HMAC SHA-256 Hashing
  const message = `v0:${req.headers["x-zm-request-timestamp"]}:${JSON.stringify(
    req.body
  )}`;
  const hashForVerify = crypto
    .createHmac("sha256", process.env.ZOOM_WEBHOOK_SECRET_TOKEN)
    .update(message)
    .digest("hex");

  const signature = `v0=${hashForVerify}`;

  if (req.headers["x-zm-signature"] !== signature) {
    return res.status(401).send("Unauthorized request");
  }

  // Your existing logic here
  let meetingId;
  if (payload && payload.object) {
    meetingId = payload.object.id;
  }
  if (meetingId) {
    // Find the user with this meeting ID and update their record.
    // ...
  }

  res.status(200).send();
});

module.exports = router;
