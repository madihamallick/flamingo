import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./SocketContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href =
  "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

root.render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
