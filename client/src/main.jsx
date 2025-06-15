import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={"672119636219-oi5vdpmiech53amrtphh2fkmffmv7tub.apps.googleusercontent.com"}>

    <Provider store={store}>
      <ToastContainer />
      <App />
    </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
