import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });

      setSuccess("Signup successful! You can now login.");
      setEmail("");
      setPassword("");
      setConfirm("");
    } catch (err) {
      setError("User already exists or server error");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">

        <h2 className="signup-title">Signup</h2>
        <p className="signup-subtitle">
          Create your account to continue exploring offers.
        </p>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSignup}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button className="signup-btn" type="submit">
            SIGNUP
          </button>
        </form>

        <div className="links">
          <p>
            Already have an account?
            <a href="/">Login</a>
          </p>
        </div>

      </div>
    </div>
  );
}
