import "./App.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router";

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
      <Route index path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
