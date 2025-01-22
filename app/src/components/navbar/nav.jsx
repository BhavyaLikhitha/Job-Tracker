import React from "react";
import "./nav.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-name">
          ApplyTrack<span className="green-dot">●</span>
        </span>
      </div>
      <div className="navbar-buttons">
        <button className="login-btn">Login</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
