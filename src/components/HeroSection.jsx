import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Develop faster.</h1>
        <p>Let your ideas come to life.</p>
        <button
          className="hero-button"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "/signup";
          }}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
