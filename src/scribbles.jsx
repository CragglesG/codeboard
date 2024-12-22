import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Scribbles from "./components/Scribbles.jsx";
import { LenisProvider } from "./components/LenisInstance";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LenisProvider>
      <Scribbles />
    </LenisProvider>
  </StrictMode>,
);
