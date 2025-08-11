import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/signin");
        return;
      }

      const response = await fetch("http://localhost:4000/admin/finduser/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/signin");
          throw new Error("Session expired. Please sign in again.");
        }
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = async (email) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:4000/admin/update/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error("Failed to promote user");
      }

      // Refresh user list
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:4000/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Refresh user list
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:4000/admin/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Refresh user list to update post counts
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div style={loadingStyle}>Loading...</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Admin Dashboard</h2>
      
      {error && <div style={errorStyle}>{error}</div>}

      <div style={usersGridStyle}>
        {users.map((user) => (
          <div key={user._id} style={userCardStyle}>
            <div style={userInfoStyle}>
              <h3 style={userNameStyle}>{user.firstName} {user.lastName}</h3>
              <p style={userEmailStyle}>{user.email}</p>
            </div>
            <div style={actionsStyle}>
              <button 
                onClick={() => handlePromoteToAdmin(user.email)}
                style={promoteButtonStyle}
              >
                Promote to Admin
              </button>
              <button 
                onClick={() => handleDeleteUser(user._id)}
                style={deleteButtonStyle}
              >
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const containerStyle = {
  padding: "2rem",
  maxWidth: "1200px",
  margin: "0 auto",
};

const titleStyle = {
  color: "white",
  fontSize: "2rem",
  marginBottom: "2rem",
  textAlign: "center",
};

const usersGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "2rem",
};

const userCardStyle = {
  backgroundColor: "#1f1f1f",
  borderRadius: "8px",
  padding: "1.5rem",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
};

const userInfoStyle = {
  marginBottom: "1rem",
};

const userNameStyle = {
  color: "white",
  fontSize: "1.2rem",
  margin: "0 0 0.5rem 0",
};

const userEmailStyle = {
  color: "#888",
  fontSize: "0.9rem",
  margin: "0",
};

const actionsStyle = {
  display: "flex",
  gap: "1rem",
};

const promoteButtonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#2196f3",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  flex: 1,
};

const deleteButtonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  flex: 1,
};

const loadingStyle = {
  textAlign: "center",
  padding: "2rem",
  color: "white",
  fontSize: "1.2rem",
};

const errorStyle = {
  color: "#f44336",
  textAlign: "center",
  marginBottom: "1rem",
  padding: "1rem",
  backgroundColor: "rgba(244, 67, 54, 0.1)",
  borderRadius: "4px",
};

export default AdminDashboard; 