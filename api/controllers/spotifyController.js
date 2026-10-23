const axios = require("axios");

const searchCatalogue = async (req, res) => {
  try {
    const { q, type = "track" } = req.query;

    const accessToken = req.spotifyAccessToken || req.user?.accessToken;

    if (!q) {
      return res.status(400).json({ error: "Queary paramter 'q' is required." });
    }

    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        q,
        type,
        limit: 10,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Spotify search error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch search results from Spotify." });
  }
};

module.exports = { searchCatalogue };
