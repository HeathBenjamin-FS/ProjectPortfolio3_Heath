const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  spotifyID: {
    type: String,
    unique: true,
    required: true,
  },
  userName: {
    type: String,
    default: "",
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  tokenExpire: {
    type: Date,
  },
});

module.exports = mongoose.model("User", userSchema);
