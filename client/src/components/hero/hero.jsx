import React from "react";
import "./hero.css";
import hero from "../../assets/he.png"
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleSignupNavigation = () => {
    navigate("/signup"); // Navigate to the signup page
  };
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 >Track Your Jobs Effortlessly and for Free!</h1>
        <p className="matter">
  Organize and streamline your job applications with ease. Monitor your
  progress, follow up on opportunities, and land your dream job with <br></br>
  <span className="blac">
     ApplyTrack<span className="green-dot">●</span>
  </span>
</p>

        {/* <button className="cta-button">Get Started Now</button> */}
        <button className="cta-button" onClick={handleSignupNavigation}>
      Get Started Now
    </button>
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
