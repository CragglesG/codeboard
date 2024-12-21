// src/App.jsx
import React from "react";
import "./App.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import { LenisProvider } from "./components/LenisInstance";
import "lenis/dist/lenis.css";

function App() {
  return (
    <LenisProvider>
      <div className="App">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <Footer />
      </div>
    </LenisProvider>
  );
}

export default App;
