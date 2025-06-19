import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "./contexts/AuthProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {" "}
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
      onScriptLoadError={(error) => {
        // Avoid showing error for anonymous users - just log for debugging
        console.warn("Google OAuth script failed to load:", error);

        // Log the client ID (partially masked for security)
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (clientId) {
          const maskedId = `${clientId.substring(0, 5)}...${clientId.substring(
            clientId.length - 5
          )}`;
          console.log("Using Google Client ID:", maskedId);
        } else {
          console.warn(
            "VITE_GOOGLE_CLIENT_ID is not set in environment variables"
          );
        }
      }}
      onScriptLoadSuccess={() => {
        console.log("Google OAuth script loaded successfully");
      }}
      useOneTap={false}
      skipTokenCache={true} // Skip token caching to avoid issues
      flow="implicit" // Use implicit flow
      disableAutoLogin={true} // Disable automatic login attempts
    >
      <AuthProvider>
        <ToastContainer />
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
