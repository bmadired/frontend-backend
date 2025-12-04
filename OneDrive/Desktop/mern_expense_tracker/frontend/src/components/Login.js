import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Save token
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">
          Welcome! Login to get amazing discounts and offers only for you.
        </p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          
          <label>User Name</label>
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="remember">
            <input type="checkbox" />
            <span>Remember me</span>
          </div>

          <button className="login-btn" type="submit">
            LOGIN
          </button>
        </form>

        <div className="links">
          <p>
            New User?
            <a href="/signup">Signup</a>
          </p>

          <a href="/forgot" className="forgot-password">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
