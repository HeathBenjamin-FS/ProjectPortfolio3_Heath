const axios = require("axios");
const querystring = require("querystring");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const callback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("No code provided by Spotify.");
  }

  try {
    const authString = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    });

    const response = await axios.post("https://accounts.spotify.com/api/token", body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authString}`,
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    const details = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const tokenExpire = new Date(Date.now() + expires_in * 1000);

    //only if Spotify doesn't give another refresh token!
    const updateData = {
      spotifyID: details.data.id,
      userName: details.data.display_name || "",
      accessToken: access_token,
      tokenExpire: tokenExpire,
    };

    if (refresh_token) {
      updateData.refreshToken = refresh_token;
    }

    const user = await User.findOneAndUpdate({ spotifyID: details.data.id }, updateData, { upsert: true, new: true });

    const appToken = jwt.sign(
      {
        userId: user._id,
        spotifyID: user.spotifyID,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "Token received successfully!",
      token: appToken,
      user: {
        id: user._id,
        spotifyID: user.spotifyID,
        userName: user.userName,
      },
    });
  } catch (error) {
    console.error("Token exchange failed:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Failed to exchange token",
      details: error.response?.data || error.message,
    });
  }
};

const login = (req, res) => {
  const scope = "user-read-private user-read-email";

  const queryParams = querystring.stringify({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
};

module.exports = { login, callback };
