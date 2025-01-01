import "./HeroSection.css";
import { authClient } from "../lib/auth.client";

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Develop faster.</h1>
        <p>Let your ideas come to life.</p>
        <button
          className="hero-button"
          onClick={async (e) => {
            e.preventDefault();
            const { data } = await authClient.getSession();
            const session = data != null;
            if (session) {
              window.location.href = "/dashboard";
            } else {
              window.location.href = "/auth";
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
