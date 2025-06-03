import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

/* Global Styles */
import "../src/styles/Main/variables.css";
import "../src/styles/Main/buttons.css";
import "../src/styles/Main/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
