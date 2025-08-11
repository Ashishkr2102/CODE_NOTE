import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Signup from "./signup";
import Signin from "./signin";
import Home from "./Home";
import CreateBlog from "./CreateBlog";
import MyBlogs from "./MyBlogs";
import Profile from "./Profile";
import Signout from "./Signout";
import AdminSignin from "./AdminSignin";
import AdminDashboard from "./AdminDashboard";
import AdminSignout from "./AdminSignout";
import AdminSignup from "./AdminSignup";

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token");
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
}

// Admin Protected Route Component
function AdminProtectedRoute({ children }) {
  const isAdminAuthenticated = localStorage.getItem("adminToken");
  
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/signin" replace />;
  }
  
  return children;
}

// Main App
function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#121212",
          color: "white",
        }}
      >
        <Navbar />
        <Content />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

// Navbar with conditional links for guest, authenticated user, or admin
function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  const isAdminAuthenticated = localStorage.getItem("adminToken");

  return (
    <div style={navbarStyle}>
      <div style={logoContainerStyle}>
        <div style={logoStyle} onClick={() => navigate("/")}>
          Code Note
        </div>
      </div>
      <div style={navLinksStyle}>
        <div style={navLinkStyle} onClick={() => navigate("/")}>
          Home
        </div>
        {isAdminAuthenticated ? (
          <>
            <div style={navLinkStyle} onClick={() => navigate("/admin/dashboard")}>
              Dashboard
            </div>
            <div style={navLinkStyle} onClick={() => navigate("/admin/signout")}>
              Admin Signout
            </div>
          </>
        ) : isAuthenticated ? (
          <>
            <div style={navLinkStyle} onClick={() => navigate("/create")}>
              Create Blog
            </div>
            <div style={navLinkStyle} onClick={() => navigate("/profile")}>
              Profile
            </div>
            <div style={navLinkStyle} onClick={() => navigate("/signout")}>
              Signout
            </div>
          </>
        ) : (
          <>
            <div style={navLinkStyle} onClick={() => navigate("/signin")}>
              Signin
            </div>
            <div style={navLinkStyle} onClick={() => navigate("/signup")}>
              Signup
            </div>
            <div style={navLinkStyle} onClick={() => navigate("/admin/signin")}>
              Admin
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Content area using Outlet to render routed components
function Content() {
  return (
    <main style={contentStyle}>
      <div style={contentInnerStyle}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/signout" element={<Signout />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Admin Routes */}
          <Route path="/admin/signin" element={<AdminSignin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/signout" element={<AdminSignout />} />
          <Route path="/admin/dashboard" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
        </Routes>
      </div>
    </main>
  );
}

// Footer
function Footer() {
  return (
    <footer style={footerStyle}>
      <p>© 2025 Code Note. All rights reserved.</p>
    </footer>
  );
}

// Individual Route Components
function MyBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await fetch("http://localhost:4000/blog/posts", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        setBlogs(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [navigate]);

  const handleDelete = async (blogId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/blog/${blogId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      // Remove the deleted blog from the state
      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div style={loadingStyle}>Loading your blogs...</div>;
  }

  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }

  return (
    <div style={myBlogsContainerStyle}>
      <h2 style={titleStyle}>My Blogs</h2>
      {blogs.length === 0 ? (
        <p style={noBlogsStyle}>You haven't created any blogs yet.</p>
      ) : (
        <div style={blogsGridStyle}>
          {blogs.map((blog) => (
            <div key={blog._id} style={blogCardStyle}>
              {blog.coverImage && (
                <img 
                  src={`http://localhost:4000${blog.coverImage}`} 
                  alt={blog.title} 
                  style={blogImageStyle}
                />
              )}
              <div style={blogContentStyle}>
                <h3 style={blogTitleStyle}>{blog.title}</h3>
                <p style={blogStatusStyle}>Status: {blog.status}</p>
                <p style={blogDateStyle}>
                  Created: {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <div style={blogActionsStyle}>
                  <button 
                    onClick={() => navigate(`/edit/${blog._id}`)} 
                    style={editButtonStyle}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(blog._id)} 
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

// Styles
const navbarStyle = {
  height: "20vh",
  width: "100%",
  backgroundColor: "#1f1f1f",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 2rem",
  boxSizing: "border-box",
};

const logoContainerStyle = {
  display: "flex",
  alignItems: "center",
};

const logoStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  cursor: "pointer",
  color: "#4caf50",
  transition: "color 0.3s ease",
  "&:hover": {
    color: "#45a049",
  },
};

const navLinksStyle = {
  display: "flex",
  gap: "2rem",
  alignItems: "center",
};

const navLinkStyle = {
  cursor: "pointer",
  color: "white",
  fontSize: "1.1rem",
  fontWeight: "500",
  transition: "color 0.3s ease",
  "&:hover": {
    color: "#4caf50",
  },
};

const contentStyle = {
  height: "65vh",
  width: "100%",
  overflowY: "auto",
  padding: "1rem 20px",
  backgroundColor: "#181818",
  boxSizing: "border-box",
};

const contentInnerStyle = {
  maxWidth: "800px",
  margin: "auto",
};

const footerStyle = {
  height: "15vh",
  width: "100%",
  backgroundColor: "#121212",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

// Additional styles for MyBlog component
const myBlogsContainerStyle = {
  padding: "2rem",
  maxWidth: "1200px",
  margin: "0 auto",
};

const blogsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "2rem",
  marginTop: "2rem",
};

const blogCardStyle = {
  backgroundColor: "#1f1f1f",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
};

const blogImageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
};

const blogContentStyle = {
  padding: "1rem",
};

const blogTitleStyle = {
  margin: "0 0 0.5rem 0",
  fontSize: "1.25rem",
  color: "white",
};

const blogStatusStyle = {
  color: "#888",
  fontSize: "0.9rem",
  margin: "0.5rem 0",
};

const blogDateStyle = {
  color: "#888",
  fontSize: "0.8rem",
  margin: "0.5rem 0",
};

const blogActionsStyle = {
  display: "flex",
  gap: "1rem",
  marginTop: "1rem",
};

const editButtonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const deleteButtonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const loadingStyle = {
  textAlign: "center",
  padding: "2rem",
  color: "white",
};

const noBlogsStyle = {
  textAlign: "center",
  color: "#888",
  marginTop: "2rem",
};
