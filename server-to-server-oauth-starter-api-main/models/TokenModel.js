const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    access_token: {
      type: String,
      required: true,
    },
    expires_in: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);
