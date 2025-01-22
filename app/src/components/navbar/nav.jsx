import React from "react";
import "./nav.css";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="navbar">
       <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <span className="brand-name">
            ApplyTrack<span className="green-dot">●</span>
          </span>
        </Link>
      </div>
       <div className="navbar-buttons">
        <Link to="/login" className="login-btn">
          Login
        </Link>
        <Link to="/signup" className="signup-btn">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
