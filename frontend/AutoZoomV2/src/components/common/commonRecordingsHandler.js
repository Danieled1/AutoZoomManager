import axios from "axios";
import { format, isValid } from "date-fns";
const excludedZoomAccountId = "K4vA4XKUSoKC-oYP5I4UOA";
const CommonRecordingsHandler = {
  async fetchRecordings(apiBaseUrl, usersMap, date, setRecordings, displaySuccessToast, displayErrorToast, setIsLoading, setSearchPerformed) {
    try {
      // console.log("Current base url:", `${apiBaseUrl}`);
      setIsLoading(true);
      const promises = Object.values(usersMap).filter(user => user.zoomAccountId !== excludedZoomAccountId).map(async (user) => {
        const response = await axios.get(
          `${apiBaseUrl}/api/users/${user.zoomAccountId}/recordings`,
          {
            params: {
              from: date,
              to: date,
            },
          }
        );

        const { data } = response;

        const userRecordings = data.meetings.flatMap((meeting) => {
          const start_time = new Date(meeting.start_time);
          if (!isValid(start_time)) return [];

          return meeting.recording_files.flatMap((recording, index) => {

            if (recording.file_type === "CHAT") return [];

            return {
              topic: `${meeting.topic}_${index + 1}`,
              start_time: format(start_time, "PPP p"),
              download_url: recording.download_url,
              meetingId: meeting.id,
              recordingId: recording.id,
              file_size: recording.file_size,
            };
          });
        });

        return {
          user: user.name,
          recordings: userRecordings,
        };
      });

      const results = await Promise.all(promises);
      const resultsWithRecordings = results.filter(
        (result) => result.recordings.length > 0
      );
      // console.log(resultsWithRecordings, "All the recordings");
      setRecordings(resultsWithRecordings);
      setSearchPerformed(true);
      setIsLoading(false);
      displaySuccessToast(
        `Recordings Fetched.`,
        `The recordings of ${date} has been successfully fetched`,
        `info`
      );
    } catch (error) {
      console.error("Error fetching recordings:", error);
      displayErrorToast(
        `Failed to Fetch Recordings`,
        `An error occurred while fetching the meeting.\n Error:${error}`
      );
    }
  },

  downloadAllRecordings(recordings, selectedRecording, setDownloadsInitiated, displaySuccessToast, displayErrorToast) {
    try {
      if (selectedRecording) {
        window.open(selectedRecording.download_url, "_blank");
      } else {
        recordings.forEach((result) => {
          result.recordings.forEach((recording) => {
            window.open(recording.download_url, "_blank");
            setDownloadsInitiated(true);
          });
        });
      }
      displaySuccessToast(
        `Downloading Started.`,
        `It will take some time based on the file size`,
        `info`
      );
    } catch (err) {
      console.error("Error downloading recordings:", err);
      displayErrorToast(
        `Failed to Download Recordings`,
        `An error occurred while downloading the recording.\n Error:${err}\n`
      );
    }
  },

  async deleteMeetingRecordings(apiBaseUrl,action,  meetingId, recordings, recordingId, setRecordings, displaySuccessToast, displayErrorToast) {
    try {
      const response = await axios.delete(
        `${apiBaseUrl}/api/meetings/${meetingId}/recordings`,
        {
          params: { action },
        }
      );
      if (response.status === 200) {
        setRecordings((prevRecordings) =>
          prevRecordings.map((userRecordings) => {
            if (
              userRecordings.recordings.some(
                (recording) => recording.recordingId === recordingId
              )
            ) {
              return {
                ...userRecordings,
                recordings: userRecordings.recordings.filter(
                  (recording) => recording.recordingId !== recordingId
                ),
              };
            } else {
              return userRecordings;
            }
          })
        );
        displaySuccessToast(
          `Recording Deleted.`,
          `Successfully deleted the recording`,
          `info`
        );
      }
    } catch (err) {
      console.error("Error deleting recordings:", err);
      displayErrorToast(
        `Failed to Delete Recording`,
        `An error occurred while deleting the recording.\n Error:${err}\n`
      );
    }
  },

  async deleteAllRecordings(apiBaseUrl, recordings, setRecordings, displaySuccessToast, displayErrorToast, action) {
    try {
      let deletedRecordings = [];
      
      console.time("Original Version");
      
      for (let userRecordings of recordings) {
        for (let recording of userRecordings.recordings) {
          const response = await axios.delete(
            `${apiBaseUrl}/api/meetings/${recording.meetingId}/recordings`,
            {
              params: { action, recordingId: recording.recordingId },
            }
          );
          if (response.status === 200) {
            deletedRecordings.push(recording.recordingId);
          }
        }
      }
      
      setRecordings((prevRecordings) =>
        prevRecordings.map((userRecordings) => ({
          ...userRecordings,
          recordings: userRecordings.recordings.filter(
            (recording) => !deletedRecordings.includes(recording.recordingId)
          ),
        }))
      );
      
      if (
        deletedRecordings.length ===
        recordings.flatMap((r) => r.recordings).length
      ) {
        displaySuccessToast(
          `Recording Deleted.`,
          `Successfully deleted the recording`,
          `info`
        );
      } else {
        throw new Error("Not all recordings were deleted successfully");
      }
      
      console.timeEnd("Original Version");
    } catch (err) {
      console.error("Error deleting recordings:", err);
      displayErrorToast(
        `Failed to Delete Recording`,
        `An error occurred while deleting the recording.\n Error:${err}\n`
      );
    }
  }
  

};

export default CommonRecordingsHandler;
