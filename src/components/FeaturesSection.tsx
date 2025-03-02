import "../assets/css/FeaturesSection.css";

function FeaturesSection() {
  return (
    <section className="features" id="features">
      <h2>Key Features</h2>
      <div className="feature-cards">
        <div className="feature-card">
          <h3>Scribbles</h3>
          <p>
            Jot down ideas on-the-go in an editor supporting markdown, drawings,
            and charts.
          </p>
        </div>
        <div className="feature-card">
          <h3>Boards</h3>
          <p>
            Refine and develop your ideas with the help of specially-designed AI
            and NLP.
          </p>
        </div>
        <div className="feature-card">
          <h3>Jumpstarts</h3>
          <h4>Coming Soon</h4>
          <p>
            Get making straight away with pre-configured dev environments ready
            just when you need them.
          </p>
        </div>
        <div className="feature-card">
          <h3>Prototypes</h3>
          <h4>Coming Soon</h4>
          <p>
            Tweak important features of your implementation and automatically
            create new versions.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
