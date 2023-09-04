const express = require("express");
const router = express.Router();
const crypto = require("crypto");

router.post("/meeting-ended", async (req, res) => {
  try {
    // Log request body
    console.log("Received request body:", req.body);
    
    // Log request headers
    console.log("Received request headers:", req.headers);

    // Check if the ZOOM_SECRET_TOKEN is available
    if (!process.env.ZOOM_SECRET_TOKEN) {
      console.error("ZOOM_SECRET_TOKEN not set.");
      return res.status(500).send("Server configuration error: ZOOM_SECRET_TOKEN not set.");
    }

    const { event, payload } = req.body;
    const message = `v0:${req.headers["x-zm-request-timestamp"]}:${JSON.stringify(req.body)}`;

    const hashForVerify = crypto
      .createHmac("sha256", process.env.ZOOM_SECRET_TOKEN)
      .update(message)
      .digest("hex");

    const signature = `v0=${hashForVerify}`;

    // Log expected and received signatures
    console.log(`Expected Signature: ${signature}`);
    console.log(`Received Signature: ${req.headers["x-zm-signature"]}`);

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
      // Log when the event is not as expected
      console.log(`Unexpected event: ${event}`);
      
      res.status(401).json({
        message: "Unauthorized request to Zoom Webhook",
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    
    // Send detailed error message in the response
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

module.exports = router;
