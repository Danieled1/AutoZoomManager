const express = require("express");
const router = express.Router();

router.post("/meeting-ended", async (req, res) => {
  const zoomToken = req.headerConfig; // This is a hypothetical header. Check Zoom's documentation for the exact header name.
  console.log(zoomToken);
  // // Verify the token
  // if (zoomToken !== process.env.ZOOM_VERIFICATION_TOKEN) {
  //   return res.status(401).send("Unauthorized request");
  // }

  const { payload, event } = req.body;
  if (event === "endpoint.url_validation") {
    // Handle URL validation here
    return res.status(200).send();
  }
  let meetingId;
  if (payload && payload.object) {
    meetingId = payload.object.id;
  }
  console.log(payload, meetingId);
  // if (meetingId) {
  //   // Now find the user with this meeting ID and update their record.
  //   // ...
  // }
  res.status(200).send();
});

module.exports = router;
