const express = require("express");
const router = express.Router();
const crypto = require("crypto");
router.post("/meeting-ended", async (req, res) => {
  const { event, payload } = req.body;
  // For HMAC SHA-256 Hashing
  const message = `v0:${req.headers["x-zm-request-timestamp"]}:${JSON.stringify(
    req.body
  )}`;
  console.log( process.env.ZOOM_SECRET_TOKEN);
  const hashForVerify = crypto
    .createHmac("sha256", process.env.ZOOM_SECRET_TOKEN)
    .update(message)
    .digest("hex");

  const signature = `v0=${hashForVerify}`;

  if (req.headers["x-zm-signature"] !== signature) {
    return res.status(401).send("Unauthorized request");
  }
  if(event === "endpoint.url_validation"){
    const hashForValidate = crypto.createHmac('sha256', process.env.ZOOM_SECRET_TOKEN).update(payload.plainToken).digest('hex')
    console.log(hashForValidate, "hashForValidate");
    res.status(200).json({
      message: {
        plainToken: payload.plainToken,
        encryptedToken: hashForValidate
      }
    });
  } else {
    res.status(401).json({
      message: "Unauthorized request to Zoom Webhook",
    });
  }

  
});

module.exports = router;
