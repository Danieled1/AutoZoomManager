const express = require("express");
const router = express.Router();

router.post("/meeting-ended", async (req, res) => {
  const { payload, event } = req.body;

  if (event === "endpoint.url_validation") {
    // Handle URL validation here
    console.log("ENDPOINT.URL_VALIDATON SUCCESS");
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
