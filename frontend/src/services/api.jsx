const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchFromApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem("spotify_jwt");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("spotify_jwt");
    window.location.href = "/login";
    throw new Error("Session expired.");
  }

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};
