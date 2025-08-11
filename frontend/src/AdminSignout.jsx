import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminSignout() {
  const navigate = useNavigate();

  useEffect(() => {
    const signOut = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (token) {
          await fetch("http://localhost:4000/admin/signout", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
        }
      } catch (error) {
        console.error("Error during signout:", error);
      } finally {
        // Clear admin token and redirect regardless of API call success
        localStorage.removeItem("adminToken");
        navigate("/admin/signin");
      }
    };

    signOut();
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <p style={messageStyle}>Signing out...</p>
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
};

export default AdminSignout; 