import React from "react";
import "./hero.css";
import hero from "../../assets/he.png"

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 >Track Your Jobs Effortlessly and for Free!</h1>
        <p className="matter">
          Organize and streamline your job applications with ease. Monitor your
          progress, follow up on opportunities, and land your dream job with
          ApplyTrack.
        </p>
        <button className="cta-button">Get Started Now</button>
      </div>
      <div className="hero-image">
        <img
          src={hero}
          alt="Track jobs effortlessly"
        />
      </div>
    </section>
  );
};

export default Hero;
