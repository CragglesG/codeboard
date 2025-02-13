import "./App.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";

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
    <Home />
  );
}

export default App;
