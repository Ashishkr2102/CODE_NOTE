import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminSignin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:4000/admin/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign in");
      }

      // Store admin token
      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={titleStyle}>Admin Sign In</h2>
        
        {error && <div style={errorStyle}>{error}</div>}

        <div style={inputGroupStyle}>
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            style={inputStyle}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={inputGroupStyle}>
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            style={inputStyle}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" style={buttonStyle}>Sign In</button>
        
        <div style={signupLinkStyle}>
          Don't have an account?{" "}
          <span 
            style={linkStyle} 
            onClick={() => navigate("/admin/signup")}
          >
            Sign Up
          </span>
        </div>
      </form>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  minHeight: "100vh",
  padding: "1rem",
  paddingTop: "2rem",
};

const formStyle = {
  width: "100%",
  maxWidth: "320px",
  padding: "1.5rem",
  backgroundColor: "#1f1f1f",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const titleStyle = {
  textAlign: "center",
  color: "white",
  marginBottom: "1rem",
  fontSize: "1.5rem",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "0.75rem",
};

const inputStyle = {
  padding: "0.5rem 0.75rem",
  fontSize: "0.9rem",
  borderRadius: "6px",
  border: "1px solid #444",
  backgroundColor: "#333",
  color: "white",
  outline: "none",
  transition: "border-color 0.3s ease",
};

const buttonStyle = {
  width: "100%",
  padding: "0.75rem",
  fontSize: "1rem",
  fontWeight: "600",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#4caf50",
  color: "white",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

const errorStyle = {
  color: "#ff4444",
  marginBottom: "1rem",
  textAlign: "center",
  fontSize: "0.9rem",
};

const signupLinkStyle = {
  textAlign: "center",
  color: "#888",
  fontSize: "0.9rem",
  marginTop: "1rem",
};

const linkStyle = {
  color: "#4caf50",
  cursor: "pointer",
  textDecoration: "underline",
};

export default AdminSignin; 