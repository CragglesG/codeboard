import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Scribbles from "./components/Scribbles.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Scribbles />
  </StrictMode>,
);
