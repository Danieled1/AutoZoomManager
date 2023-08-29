const mongoose = require("mongoose");

const zoomUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    zoomAccountId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sessions: {
      type: Number,
      default: 0,
    },
    meetingIds: {
      type: [String],
      default: [],
    },
    currentTeacher: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const ZoomUser = mongoose.model("User", zoomUserSchema);

module.exports = ZoomUser;
