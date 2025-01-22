import React from "react";
import "./nav.css";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-name">
          ApplyTrack<span className="green-dot">●</span>
        </span>
      </div>
      {/* <div className="navbar-buttons">
        <button className="login-btn">Login</button>
        <button className="signup-btn">Sign Up</button>
      </div> */}
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
