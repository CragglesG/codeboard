// src/components/Header.jsx
import { PropTypes } from "prop-types";
import { useLenis } from "./LenisInstance";
import "./Header.css";

function Header() {
  const lenis = useLenis();

  const handleScroll = (e, target) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, {
        duration: 2,
        offset: 100,
      });
    }
  };

  return (
    <header className="header">
      <div className="logo">Codeboard</div>
      <nav className="nav">
        <a href="#features" onClick={(e) => handleScroll(e, "#features")}>
          Features
        </a>
        <a href="#about" onClick={(e) => handleScroll(e, "#about")}>
          About
        </a>
        <a href="#contact" onClick={(e) => handleScroll(e, "#contact")}>
          Contact
        </a>
      </nav>
    </header>
  );
}

export default Header;
