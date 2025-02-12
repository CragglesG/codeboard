import "./App.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router";
import Scribbles from "./routes/Scribbles";
import Dashboard from "./routes/Dashboard";

const Home = () => (
  <div className="App">
    <Header />
    <HeroSection />
    <FeaturesSection />
    <Footer />
  </div>
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
