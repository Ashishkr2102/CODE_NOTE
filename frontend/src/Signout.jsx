import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Signout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    
    // Redirect to home page
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <div style={messageStyle}>
        Signing out...
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#121212",
};

const messageStyle = {
  color: "white",
  fontSize: "1.2rem",
  textAlign: "center",
};

export default Signout; 