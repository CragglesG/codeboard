// src/App.jsx
import "./App.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import { LenisProvider } from "./components/LenisInstance";
import "lenis/dist/lenis.css";
import { Routes, Route } from "react-router";
import Scribbles from "./components/Scribbles";

const Home = () => (
  <LenisProvider>
    <div className="App">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  </LenisProvider>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scribbles" element={<Scribbles />} />
    </Routes>
  );
}

export default App;
