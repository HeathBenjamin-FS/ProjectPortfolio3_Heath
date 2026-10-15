const axios = require("axios");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const refreshSpotifyToken = async (user) => {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: user.refreshToken,
  });

  const basicAuth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");

  const response = await axios.post("https://accounts.spotify.com/api/token", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
  });

  const { access_token, expires_in, refresh_token: newRefreshToken } = response.data;

  user.accessToken = access_token;
  user.tokenExpire = new Date(Date.now() + expires_in * 1000);

  if (newRefreshToken) {
    user.refreshToken = newRefreshToken;
  }

  await user.save();
  return access_token;
};

// checking to see if the user needs to log in/ relog
const checkAuthStatus = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(200).json({ authenticated: false });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshToken) {
      return res.status(200).json({ authenticated: false });
    }

    return res.status(200).json({ authenticated: true });
  } catch (error) {
    // If JWT is expired or incorrect, user must reauth
    return res.status(200).json({ authenticated: false });
  }
};

const requireValidSpotifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "Missing or invalid authorization." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User session not found" });
    }

    const now = new Date();

    if (!user.tokenExpire || now >= new Date(user.tokenExpire.getTime() - 60000)) {
      req.spotifyAccessToken = await refreshSpotifyToken(user);
    } else {
      req.spotifyAccessToken = user.accessToken;
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired session. Please log in again." });
  }
};

module.exports = { checkAuthStatus, refreshSpotifyToken, requireValidSpotifyToken };
