import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/login";
import { Dashboard } from "./pages/Dashboard";
import "./App.css";

const DashboardThing = () => {
  const { logout } = useAuth();
  return (
    <div>
      <div>
        <h2>Authenticated Successfully</h2>
        <p>JWT is stored and routes are protected.</p>
        <button onClick={logout}>Log out</button>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {/* <DashboardThing /> */}
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
export default App;
