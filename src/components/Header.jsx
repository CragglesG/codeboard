// src/components/Header.jsx
import "../assets/css/Header.css";
import PropTypes from "prop-types";

function Header({ extraItem }) {
  Header.propTypes = {
    extraItem: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]),
  };

  return (
    <header className="header">
      <a className="logo" href="/">
        Codeboard
      </a>
      {extraItem}
      <nav className="nav">
        <a href="/signin">Sign In</a>
      </nav>
    </header>
  );
}

export default Header;
