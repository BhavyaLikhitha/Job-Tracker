import React, { useContext } from "react";
import "./nav.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext.jsx";

const Navbar = () => {
  const { isLoggedIn, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
        {isLoggedIn ? (
          <>
            <p className="welcome-msg">Welcome, {username} ❤️!</p>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
