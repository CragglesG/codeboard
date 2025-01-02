import "./HeroSection.css";
import { authClient } from "../lib/auth.client";
import { useState, useEffect } from "react";

function HeroSection() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await authClient.getSession();
        if (data != null) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          window.location.href = "/signin";
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthenticated(false);
        window.location.href = "/signin";
      }
    };

    checkSession();
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Develop faster.</h1>
        <p>Let your ideas come to life.</p>
        <button
          className="hero-button"
          onClick={async (e) => {
            e.preventDefault();
            if (authenticated) {
              window.location.href = "/dashboard";
            } else {
              window.location.href = "/signup";
            }
          }}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
