const express = require("express");
const axios = require("axios");
const qs = require("query-string");
const moment = require('moment');
const errorHandler = require("../../utils/errorHandler");
const { ZOOM_API_BASE_URL } = require("../../constants");
const ZoomUser = require("../../models/ZoomUser");
const router = express.Router();
const schedule = require('node-schedule');



/**
 * Get a meeting
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meeting
 */
router.get("/:meetingId", async (req, res) => {
  const { headerConfig, params } = req;
  const { meetingId } = params;

  try {
    const request = await axios.get(
      `${ZOOM_API_BASE_URL}/meetings/${meetingId}`,
      headerConfig
    );
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error fetching meeting: ${meetingId}`);
  }
});

/**
 * Create a meeting
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetingCreate
 */
router.post("/:userId", async (req, res) => {
  const { headerConfig, params, body } = req;
  const { userId } = params;
  const { topic, duration } = body; // extract duration from the request body

  const meetingData = {
    topic: topic,
    type: 2, // Scheduled meeting
    duration: duration, // Meeting duration in minutes
    userId,
  };
  try {
    const request = await axios.post(
      `${ZOOM_API_BASE_URL}/users/${userId}/meetings`,
      meetingData,
      headerConfig
    );
    const zoomUser = await ZoomUser.findOne({ zoomAccountId: userId });
    if (zoomUser) {
      zoomUser.sessions += 1
      await zoomUser.save();
    }
    const date = new Date(); // Current date
    date.setMinutes(date.getMinutes() + duration); // Add the meeting duration in minutes

    schedule.scheduleJob(date, async function() {
      const userToUpdate = await ZoomUser.findOne({ zoomAccountId: userId });
      if (userToUpdate && userToUpdate.sessions > 0) {
        userToUpdate.sessions -= 1;
        await userToUpdate.save();
      }
    });

    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error creating meeting for user: ${userId}`);
  }
});

/**
 * Update a meeting
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetingUpdate
 */
router.patch("/:meetingId", async (req, res) => {
  const { headerConfig, params, body } = req;
  const { meetingId } = params;

  try {
    const request = await axios.patch(
      `${ZOOM_API_BASE_URL}/meetings/${meetingId}`,
      body,
      headerConfig
    );
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error updating meeting: ${meetingId}`);
  }
});

/**
 * Delete a meeting
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/meetingDelete
 */
router.delete("/:meetingId", async (req, res) => {
  const { headerConfig, params } = req;
  const { meetingId } = params;

  try {
    const request = await axios.delete(
      `${ZOOM_API_BASE_URL}/meetings/${meetingId}`,
      headerConfig
    );
    return res.json(request.data);
  } catch (err) {
    return errorHandler(err, res, `Error deleting meeting: ${meetingId}`);
  }
});

/**
 * Get meeting participant reports
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/reportMeetingParticipants
 */
router.get("/:meetingId/report/participants", async (req, res) => {
  const { headerConfig, params, query } = req;
  const { meetingId } = params;
  const { next_page_token } = query;

  try {
    const request = await axios.get(
      `${ZOOM_API_BASE_URL}/report/meetings/${meetingId}/participants?${qs.stringify(
        {
          next_page_token,
        }
      )}`,
      headerConfig
    );
    return res.json(request.data);
  } catch (err) {
    return errorHandler(
      err,
      res,
      `Error fetching participants for meeting: ${meetingId}`
    );
  }
});

/**
 * Delete meeting recordings
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/recordingDelete
 */
router.delete("/:meetingId/recordings", async (req, res) => {
  const { headerConfig, params, query } = req;
  const { meetingId } = params;
  const { action } = query;

  try {
    const request = await axios.delete(
      `${ZOOM_API_BASE_URL}/meetings/${meetingId}/recordings?${qs.stringify({
        action,
      })}`,
      headerConfig
    );
    return res.json(request.data);
  } catch (err) {
    return errorHandler(
      err,
      res,
      `Error deleting recordings for meeting: ${meetingId}`
    );
  }
});

module.exports = router;
