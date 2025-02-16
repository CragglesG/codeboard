// src/components/Header.jsx
import "../assets/css/Header.css";
import PropTypes from "prop-types";
import { authClient } from "../lib/auth.client";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";

function ActionLink() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await authClient.getSession();
        if (data != null) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthenticated(false);
      }
    };

    checkSession();
  });

  if (authenticated) {
    return <a href="/dashboard">Dashboard</a>;
  } else {
    return <a href="/signin">Sign In</a>;
  }
}

export default function Header({ extraItem = <div />, actionLink = true }) {
  Header.propTypes = {
    extraItem: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]),
    actionLink: PropTypes.bool,
  };

  const { pathname } = useLocation();

  return (
    <header className="header">
      {pathname === "/" || pathname === "/dashboard" ? (
        <a className="logo" href="/">
          Codeboard
        </a>
      ) : (
        <a className="logo" href="/dashboard">
          Codeboard
        </a>
      )}
      {extraItem}
      <nav className="nav">{actionLink ? <ActionLink /> : null}</nav>
    </header>
  );
}
