// import React, { useState } from "react";
// import "./login.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import loginImage from "../../assets/login.png"; // Replace with your image path

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.email && formData.password) {
//       toast.success("User successfully logged in");
//       setTimeout(() => {
//         navigate("/"); // Redirect to the home page after successful login
//       }, 2000); // Delay to show the toast message
//     } else {
//       toast.error("Please fill in all fields");
//     }
//   };

//   return (
//     <div className="login">
//       {/* Left side image */}
//       <div className="login-image">
//         <img src={loginImage} alt="Login Illustration" />
//       </div>

//       {/* Right side login form */}
//       <div className="login-form">
//         <h2>Login</h2>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />

//           <button type="submit" className="login-btn">
//             Login
//           </button>
//         </form>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Login;
// import React, { useState } from "react";
// import "./login.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import loginImage from "../../assets/login.png";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.email && formData.password) {
//       try {
//         const response = await fetch("http://localhost:3002/api/users/login", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: formData.email,
//             password: formData.password,
//           }),
//         });
  
//         if (response.ok) {
//           const data = await response.json();
//           toast.success("User successfully logged in");
//           console.log("Login Response:", data); 
//           console.log("Username from response:", data.username);
//           localStorage.setItem("token", data.token); // Store token for authenticated requests
//           localStorage.setItem("username", data.username); // Store username
//           setTimeout(() => {
//             navigate("/"); // Redirect to home page after successful login
//           }, 2000); // Delay to show the toast message
//         } else {
//           const errorData = await response.json();
//           toast.error(errorData.error || "Login failed");
//         }
//       } catch (error) {
//         toast.error("An error occurred while logging in");
//       }
//     } else {
//       toast.error("Please fill in all fields");
//     }
//   };
  

//   return (
//     <div className="login">
//       <div className="login-image">
//         <img src={loginImage} alt="Login Illustration" />
//       </div>

//       <div className="login-form">
//         <h2>Login</h2>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />

//           <button type="submit" className="login-btn">
//             Login
//           </button>
//         </form>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Login;
import React, { useState, useContext } from "react";
import "./login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import loginImage from "../../assets/login.png";
import { AuthContext } from "../../AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext); // Use AuthContext to update login state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      try {
        const response = await fetch("http://localhost:3002/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          toast.success("User successfully logged in");
          console.log("Login Response:", data); // Debugging
          localStorage.setItem("token", data.token); // Store token for authenticated requests
          localStorage.setItem("username", data.username); // Store username
          login(data.username); // Update context state
          navigate("/"); // Redirect to the home page after successful login
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Login failed");
        }
      } catch (error) {
        toast.error("An error occurred while logging in");
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  return (
    <div className="login">
      <div className="login-image">
        <img src={loginImage} alt="Login Illustration" />
      </div>

      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
