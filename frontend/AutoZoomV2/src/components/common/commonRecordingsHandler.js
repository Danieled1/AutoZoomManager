import axios from "axios";
import { format, isValid } from "date-fns";
const excludedZoomAccountId = "K4vA4XKUSoKC-oYP5I4UOA";
const CommonRecordingsHandler = {
  async fetchRecordings(
    apiBaseUrl,
    usersMap,
    date,
    setRecordings,
    displaySuccessToast,
    displayErrorToast,
    setIsLoading,
    setSearchPerformed
  ) {
    try {
      // console.log("Current base url:", `${apiBaseUrl}`);
      setIsLoading(true);
      const promises = Object.values(usersMap)
        .filter((user) => user.zoomAccountId !== excludedZoomAccountId)
        .map(async (user) => {
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
            if (!isValid(start_time) || !meeting) return [];

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
      const resultsWithRecordings = results.filter((result) => result.recordings.length > 0);
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
  async downloadSingleRecordingFromServer(displaySuccessToast, displayErrorToast, selectedRecording, apiBaseUrl) {
    try {
      console.log("Entered downloadSingleRecording in commonHandler");

      const downloadUrl = `${apiBaseUrl}/api/downloads/download-single?fileUrl=${encodeURIComponent(
        selectedRecording.download_url
      )}&title=${encodeURIComponent(selectedRecording.topic)}`;

      const response = await axios.get(downloadUrl, { responseType: "blob" });
      console.log(response);

      // Handle successful file download (video/mp4)
      if (response.headers["content-type"] === "video/mp4") {
        const blob = new Blob([response.data], { type: "video/mp4" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${selectedRecording.topic}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        displaySuccessToast(
          `Downloading ${selectedRecording.topic}.mp4`,
          "Download started successfully. Please wait a few seconds.",
          "info"
        );
      }
    } catch (error) {
      console.error("Error in handleDownload:", error);

      if (error.response && error.response.data) {
        // If the response data is a Blob, try parsing it as JSON
        const blob = error.response.data;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            console.log("Parsed Error Data:", errorData);
            displayErrorToast("Download Failed", errorData.message || "An error occurred on the server.");
          } catch (parseError) {
            console.error("Failed to parse error response as JSON:", parseError);
            displayErrorToast("Download Failed", "Unexpected error format from the server.");
          }
        };
        reader.readAsText(blob);
      } else {
        // Handle network or other unexpected errors
        displayErrorToast("Download Failed", error.message || "Unexpected error occurred.");
      }
    }
  },
  downloadAllRecordings(
    recordings,
    selectedRecording,
    setDownloadsInitiated,
    displaySuccessToast,
    displayErrorToast
  ) {
    try {
      const download = (url, filename) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      if (selectedRecording) {
        download(selectedRecording.download_url, selectedRecording.topic + ".mp4");
      } else {
        recordings.forEach((result) => {
          result.recordings.forEach((recording) => {
            download(recording.download_url, recording.topic + ".mp4");
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
  // CHANGE - New way to donwload all recordings to the server with validation of videos less then 5mb and less than 5min
  async downloadAllRecordingsFromServer(recordings, displaySuccessToast, displayErrorToast, apiBaseUrl) {
    try {
      console.log(recordings);

      const ws = new WebSocket('ws://localhost:8080');
      ws.onopen = () => {
        console.log("WebSocket connection established for download progress tracking.");
      };

      ws.onmessage = (event) => {
        const progressUpdate = JSON.parse(event.data);
        console.log("Progress Update:", progressUpdate);

        // Display progress or status in a toast or a progress bar
        displaySuccessToast(
          `Downloading ${progressUpdate.topic}`,
          `Progress: ${progressUpdate.percentage}% - Status: ${progressUpdate.status}`,
          progressUpdate.status === "✅" ? "success" : "info"
        );
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      // API request to the server to trigger downloads
      const response = await axios.post(`${apiBaseUrl}/api/downloads/download-all-recordings`, { recordings });
      console.log(response.data);
      if (response.status === 200) {
        displaySuccessToast(
          "Downloading started.",
          "It will take some time based on the file size.",
          "info"
        );
      }
    } catch (err) {
      console.error("Error downloading recordings:", err);
      displayErrorToast(
        "Failed to Download Recordings",
        `An error occurred while downloading the recording.\n Error: ${err}\n`
      );
    }
  },

  async deleteSingle(
    apiBaseUrl,
    action,
    meetingId,
    recordings,
    recordingId,
    setRecordings,
    displaySuccessToast,
    displayErrorToast
  ) {
    try {
      const response = await axios.delete(`${apiBaseUrl}/api/meetings/${meetingId}/recordings`, {
        params: { action },
      });
      if (response.status === 200) {
        setRecordings((prevRecordings) =>
          prevRecordings.map((userRecordings) => {
            if (
              userRecordings.recordings.some((recording) => recording.recordingId === recordingId)
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
        displaySuccessToast(`Recording Deleted.`, `Successfully deleted the recording`, `info`);
      }
    } catch (err) {
      console.error("Error deleting recordings:", err);
      displayErrorToast(
        `Failed to Delete Recording`,
        `An error occurred while deleting the recording.\n Error:${err}\n`
      );
    }
  },

  async deleteAllRecordings(
    apiBaseUrl,
    recordings,
    setRecordings,
    displaySuccessToast,
    displayErrorToast,
    action
  ) {
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

      if (deletedRecordings.length === recordings.flatMap((r) => r.recordings).length) {
        displaySuccessToast(`Recording Deleted.`, `Successfully deleted the recording`, `info`);
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
  },
};

export default CommonRecordingsHandler;
