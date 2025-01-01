// src/App.jsx
import "./App.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import { LenisProvider } from "./components/LenisInstance";
import "lenis/dist/lenis.css";
import { Routes, Route } from "react-router";
import Scribbles from "./components/Scribbles.tsx";
import Dashboard from "./components/Dashboard.jsx";

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
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
