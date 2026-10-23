import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSpotifyLogin = () => {
    window.location.href = "http://127.0.0.1:3000/login";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badgeRow}>
          <span style={{ ...styles.badge, backgroundColor: "#ef4444" }}>S</span>
          <span style={{ ...styles.badge, backgroundColor: "#f97316" }}>A</span>
          <span style={{ ...styles.badge, backgroundColor: "#f59e0b" }}>B</span>
          <span style={{ ...styles.badge, backgroundColor: "#10b981" }}>C</span>
          <span style={{ ...styles.badge, backgroundColor: "#3b82f6" }}>D</span>
        </div>

        <h1>
          Spotify <span style={{ color: "#1db954" }}>Tier List</span>
        </h1>
        <p>Sign in with your Spotify account to rank tracks, albums, and artists.</p>

        <button onClick={handleSpotifyLogin} style={styles.button}>
          Log in with Spotify
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b0c10",
    color: "#ededed",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  card: {
    backgroundColor: "#16181d",
    border: "1px solid #232733",
    borderRadius: "16px",
    padding: "2.5rem 2rem",
    maxWidth: "380px",
    width: "95%",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  badgeRow: {
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    marginBottom: "1.25rem",
  },
  badge: {
    fontSize: "0.75rem",
    fontWeight: "900",
    padding: "2px 8px",
    borderRadius: "4px",
    color: "#000",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "800",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "0.85rem",
    color: "#8c92a4",
    marginBottom: "1.75rem",
    lineHeight: "1.4",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "#1db954",
    color: "#000",
    fontWeight: "700",
    fontSize: "0.95rem",
    border: "none",
    borderRadius: "9999px",
    padding: "0.8rem 1.5rem",
    cursor: "pointer",
    width: "100%",
    transition: "background 0.2s",
  },
  spotifyIcon: {
    width: "20px",
    height: "20px",
    fill: "currentColor",
  },
};
