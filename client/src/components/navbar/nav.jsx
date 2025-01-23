// import React from "react";
// import "./nav.css";
// import { Link } from "react-router-dom";
// const Navbar = () => {
//   return (
//     <nav className="navbar">
//        <div className="navbar-brand">
//         <Link to="/" className="brand-link">
//           <span className="brand-name">
//             ApplyTrack<span className="green-dot">●</span>
//           </span>
//         </Link>
//       </div>
//        <div className="navbar-buttons">
//         <Link to="/login" className="login-btn">
//           Login
//         </Link>
//         <Link to="/signup" className="signup-btn">
//           Sign Up
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// import React, { useEffect, useState } from "react";
// import "./nav.css";
// import { Link, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const savedUsername = localStorage.getItem("username");
//     if (token && savedUsername) {
//       setIsLoggedIn(true);
//       setUsername(savedUsername);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("username");
//     setIsLoggedIn(false);
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-brand">
//         <Link to="/" className="brand-link">
//           <span className="brand-name">
//             ApplyTrack<span className="green-dot">●</span>
//           </span>
//         </Link>
//       </div>
//       <div className="navbar-buttons">
//         {isLoggedIn ? (
//           <>
//             <span className="welcome-msg">Welcome, {username}</span>
//             <button onClick={handleLogout} className="logout-btn">
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="login-btn">
//               Login
//             </Link>
//             <Link to="/signup" className="signup-btn">
//               Sign Up
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import React, { useEffect, useState } from "react";
// import "./nav.css";
// import { Link, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch token and username from localStorage
//     const token = localStorage.getItem("token");
//     const savedUsername = localStorage.getItem("username");
//     console.log("Saved Username:", savedUsername);
//     if (token && savedUsername) {
//       setIsLoggedIn(true);
//       setUsername(savedUsername);
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, []);

//   const handleLogout = () => {
//     // Clear user-related data from localStorage
//     localStorage.removeItem("token");
//     localStorage.removeItem("username");

//     // Update state and navigate to login
//     setIsLoggedIn(false);
//     setUsername("");
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-brand">
//         <Link to="/" className="brand-link">
//           <span className="brand-name">
//             ApplyTrack<span className="green-dot">●</span>
//           </span>
//         </Link>
//       </div>
//       <div className="navbar-buttons">
//         {isLoggedIn ? (
//           <>
//             <p className="welcome-msg">Welcome, {username} ❤️!</p>
//             <button onClick={handleLogout} className="logout-btn">
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="login-btn">
//               Login
//             </Link>
//             <Link to="/signup" className="signup-btn">
//               Sign Up
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
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
