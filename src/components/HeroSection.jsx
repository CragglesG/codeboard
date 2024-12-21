// src/components/HeroSection.jsx
import React from 'react';
import './HeroSection.css';

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Develop faster.</h1>
        <p>Let your ideas come to life.</p>
        <button className="hero-button">Get Started</button>
      </div>
    </section>
  );
}

export default HeroSection;