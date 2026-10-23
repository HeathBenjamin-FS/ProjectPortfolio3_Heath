const axios = require("axios");

const getTracks = async (req, res) => {
  try {
    const query = req.query.q || "metalcore";

    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${req.spotifyAccessToken}`,
      },
      params: {
        q: query,
        type: "track",
        limit: 10,
      },
    });

    const rawItems = response.data?.tracks?.items || [];

    const tracks = rawItems.map((item) => ({
      id: item.id,
      name: item.name,
      artist: item.artists.map((a) => a.name).join(", ") || "Unknown",
      album: item.album.name || "Unkown",
      image: item.album.images[0]?.url || null,
      previewUrl: item.preview_url || null,
      spotifyUrl: item.external_urls.spotify || null,
    }));

    return res.status(200).json({
      success: true,
      query: query,
      tracks: tracks,
    });
  } catch (error) {
    console.error("Spotify API call failed", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: "Failed to fetch tracks from Spotify",
      details: error.response?.data || error.message,
    });
  }
};

module.exports = { getTracks };
