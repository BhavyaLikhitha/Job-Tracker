import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Hero from "./components/hero/hero";
import JobTracker from "./components/job";
import Navbar from "./components/navbar/nav";
import Signup from "./components/signup/signup";
import Login from "./components/login/login";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Base route displays Hero and Job Tracker */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <JobTracker />
            </>
          }
        />

        {/* Signup route displays the Signup page */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
