// src/components/Header.jsx
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
          Log In
        </a>
      </nav>
    </header>
  );
}

export default Header;
