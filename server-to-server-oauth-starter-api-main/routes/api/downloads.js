
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const WebSocket = require("ws"); // Import the WebSocket module
const wss = require("../../wss");
ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path);
const router = express.Router();
const downloadsDir = path.resolve("./downloads");
wss
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

let downloadLogs = new Map();

function updateDownloadLog(topic, percentage, finished = false) {
  const logEntry = downloadLogs.get(topic) || { status: '❌', percentage: '0%' };
  if (percentage) {
    logEntry.percentage = `${percentage.toFixed(2)}%`;
  }
  logEntry.status = finished ? '✅' : '❌';
  downloadLogs.set(topic, logEntry);
  displayDownloadLogs();
}

function displayDownloadLogs() {
  console.clear();
  console.log("The current download process:");
  downloadLogs.forEach((value, key) => {
    console.log(`${key} - ${value.status} (${value.percentage} complete)`);
  });
}
const broadcastLogUpdate = (topic, percentage, status) => {
  const message = JSON.stringify({
    topic,
    percentage,
    status,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

async function downloadFile(fileUrl, outputLocationPath, filename) {
  const response = await axios({
    method: "get",
    url: fileUrl,
    responseType: "stream",
  });

  const totalLength = response.headers["content-length"];
  let bytesDownloaded = 0;
  let lastLogged = Date.now();

  const writer = fs.createWriteStream(outputLocationPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    response.data.on("data", (chunk) => {
      bytesDownloaded += chunk.length;
      const now = Date.now();
      if (now - lastLogged >= 3000) {
        const percentage = (bytesDownloaded / totalLength) * 100;
        updateDownloadLog(filename, percentage);
        broadcastLogUpdate(filename, percentage.toFixed(2), "In Progress");
        lastLogged = now;
      }
    });

    writer.on("finish", async () => {
      const isValid = await validateVideo(outputLocationPath);
      if (!isValid) {
        fs.unlinkSync(outputLocationPath);
        updateDownloadLog(filename, 0, true); // Mark as error if fails
        broadcastLogUpdate(filename, 0, "Failed");
        console.log(`${filename} did not meet the criteria and was deleted.`);
      } else {
        updateDownloadLog(filename, 100, true);
        broadcastLogUpdate(filename, 100, "Completed");

      }
      resolve(isValid ? outputLocationPath : null);
    });

    writer.on("error", error => {
      fs.unlinkSync(outputLocationPath); // Ensure deletion on error
      updateDownloadLog(filename, 0, true);
      broadcastLogUpdate(filename, 0, "Failed");
      reject(error);
    });
  });
}

async function validateVideo(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }
      const duration = metadata.format.duration;
      const size = fs.statSync(filePath).size;
      resolve(duration >= 300 && size >= 5 * 1024 * 1024);
    });
  });
}

async function concatVideos(files, outputLocation) {
  const filteredFiles = files.filter(file => file);
  if (filteredFiles.length <= 1) return;

  return new Promise((resolve, reject) => {
    const concat = ffmpeg();
    filteredFiles.forEach(file => {
      concat.input(file);
    });
    concat.mergeToFile(outputLocation, './temp/')
      .on('error', (err) => {
        console.error(`Error concatenating files: ${err.message}`);
        reject(err);
      })
      .on('end', () => {
        console.log(`Concatenation complete for: ${outputLocation}`);
        resolve();
      });
  });
}

router.post("/download-all-recordings", async (req, res) => {
  try {
    const fileGroups = new Map();

    for (let userRecording of req.body.recordings) {
      for (let recording of userRecording.recordings) {
        let safeFileName = recording.topic.replace(/[\/\\?%*:|"<>]/g, "-");
        safeFileName = safeFileName.replace(/00\.00\.00/g, "");
        const outputLocation = path.join(downloadsDir, `${safeFileName}.mp4`);
        const groupKey = safeFileName.replace(/(_\d+)$/, ""); // Remove numeric suffix
        if (!fileGroups.has(groupKey)) {
          fileGroups.set(groupKey, []);
        }
        const result = await downloadFile(recording.download_url, outputLocation, recording.topic);
        if (result) {
          fileGroups.get(groupKey).push(outputLocation);
        }
      }
    }


    res.send("All recordings have been downloaded and processed.");
  } catch (error) {
    console.error("Failed to download:", error);
    res.status(500).send("Failed to download recordings");
  }
});

router.get("/download-single", async (req, res) => {
  try {
    const { fileUrl, title } = req.query;
    console.log(fileUrl, title);

    if (!fileUrl || !title) {
      throw new Error("Missing required parameters: fileUrl or title");
    }

    const safeFileName = title.replace(/[\/\\?%*:|"<>]/g, "-") + ".mp4";
    const outputLocationPath = path.join(downloadsDir, safeFileName);

    const result = await downloadFile(fileUrl, outputLocationPath, title);

    if (!result) {
      throw new Error("File validation failed or file could not be downloaded");
    }

    res.setHeader("Content-Disposition", `attachment; filename="${safeFileName}"`);
    res.setHeader("Content-Type", "video/mp4");
    const fileStream = fs.createReadStream(outputLocationPath);

    fileStream.pipe(res).on("finish", () => {
      fs.unlinkSync(outputLocationPath);
    });
  } catch (error) {
    console.error("Error in /download-single:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});


module.exports = router;
