import React, { useState } from "react";
import "./signup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sign from "../../assets/sign.png";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "", // Added username
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        // const response = await fetch("http://localhost:3002/api/users/signup", {
          const response = await fetch("https://job-tracker-api-rho.vercel.app/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          toast.success("User successfully registered");
          setFormData({ username: "", email: "", password: "", confirmPassword: "" });
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Signup failed");
        }
      } catch (error) {
        toast.error("An error occurred while signing up");
      }
    }
  };

  return (
    <div className="signup">
      <div className="signup-image">
        <img src={sign} alt="Signup Illustration" />
      </div>
      <div className="signup-form">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

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

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
         
          <button type="submit" className="register-btn">
            Register
          </button>
          <p className="login-link-text">
  Already have an account?{" "}
  <Link to="/login" className="login-link">
    Login
  </Link>
</p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
