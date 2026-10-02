const express = require("express");
const connectDB = require("./config.js");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.get("/api/spotify_app", (req, res) => {
  res.status(200).json({ message: "Welcome to the Spotify App! Keep checking for cool updates!" });
});
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
