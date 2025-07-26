import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const handleScriptLoadError = (error) => {
  if (import.meta.env.MODE !== "production") {
    console.warn("Google OAuth script failed to load:", error);
    if (clientId) {
      const maskedId = `${clientId.slice(0, 5)}...${clientId.slice(-5)}`;
      console.info("Using Google Client ID:", maskedId);
    } else {
      console.warn("VITE_GOOGLE_CLIENT_ID is not set.");
    }
  }
};

const handleScriptLoadSuccess = () => {
  if (import.meta.env.MODE !== "production") {
    console.info("Google OAuth script loaded successfully.");
  }
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={clientId}
      onScriptLoadError={handleScriptLoadError}
      onScriptLoadSuccess={handleScriptLoadSuccess}
      useOneTap={false}
      skipTokenCache={true}
      flow="implicit"
      disableAutoLogin={true}
    >
      <ToastContainer />
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
