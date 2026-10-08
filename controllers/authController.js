const axios = require("axios");
const querystring = require("querystring");

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

    return res.status(200).json({
      message: "Token received successfully!",
      access_token,
      refresh_token,
      expires_in,
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
