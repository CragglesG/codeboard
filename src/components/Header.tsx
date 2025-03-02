import "../assets/css/Header.css";
import PropTypes from "prop-types";
import { authClient } from "../lib/auth.client";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import ModeToggle from "./ModeToggle";

function ActionLink() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return null;
  }

  if (authenticated) {
    return <a href="/dashboard">Dashboard</a>;
  } else {
    return <a href="/signin">Sign In</a>;
  }
}

export default function Header({
  children,
  actionLink = true,
}: {
  children?: React.ReactNode;
  actionLink?: boolean;
}) {
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
      {children}
      <nav className="nav">
        {actionLink ? <ActionLink /> : null}
        <ModeToggle className="mode-toggle mr-5 rounded-full" />
      </nav>
    </header>
  );
}
