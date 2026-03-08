import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await axios.post("http://localhost:5000/api/admin-login", {
        email,
        password
      });

      console.log("API Response:", res.data);

      if (res.data && res.data.success) {

        alert("Login Successful ✅");

        localStorage.setItem("adminLoggedIn", "true");

        navigate("/admin");

      } else {

        alert("Invalid Email or Password ❌");

      }

    } catch (err) {

      console.error("Login Error:", err);
      alert("Server Error. Please check backend.");

    }

  };

  return (
    <div className="login-form">

      <h2>Admin Login</h2>

      <input
      className="login-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button className="login-button" onClick={handleLogin}>
        Login
      </button>

    </div>
  );
};

export default AdminLogin;
