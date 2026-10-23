const express = require("express");
const router = express.Router();

const { login, callback } = require("../controllers/authController.js");
const { checkAuthStatus, requireValidSpotifyToken } = require("../middlewares/spotifyRefresh");

const { searchCatalogue } = require("../controllers/spotifyController");

//authRoutes
router.get("/login", login);
router.get("/callback", callback);
router.get("/auth/status", checkAuthStatus);

//spotify routes
router.get("/spotify/search", requireValidSpotifyToken, searchCatalogue);

module.exports = router;
