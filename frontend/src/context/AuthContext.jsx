import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("spotify_jwt"));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("spotify_jwt", tokenFromUrl);
      setToken(tokenFromUrl);

      window.history.replaceState({}, document.title, window.location.pathname);

      navigate("/", { replace: true });
    }
    setIsLoading(false);
  }, [location, navigate]);

  const logout = () => {
    localStorage.removeItem("spotify_jwt");
    setToken(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
