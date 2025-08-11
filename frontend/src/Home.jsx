import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:4000/blog/all");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        // Filter to show only published blogs for non-authenticated users
        const filteredBlogs = isAuthenticated ? data : data.filter(blog => blog.status === "published");
        setBlogs(filteredBlogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [isAuthenticated]);

  if (loading) {
    return <div style={loadingStyle}>Loading blogs...</div>;
  }

  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Welcome to Code Note</h1>
        <p style={subtitleStyle}>Discover and share your coding knowledge</p>
      </div>

      {blogs.length === 0 ? (
        <div style={emptyStateStyle}>
          <p style={noBlogsStyle}>No blogs available yet.</p>
        </div>
      ) : (
        <div style={blogsGridStyle}>
          {blogs.map((blog) => (
            <div key={blog._id} style={blogCardStyle}>
              {blog.coverImage && (
                <div style={imageContainerStyle}>
                  <img 
                    src={`http://localhost:4000${blog.coverImage}`} 
                    alt={blog.title} 
                    style={blogImageStyle}
                  />
                </div>
              )}
              <div style={blogContentStyle}>
                <h3 style={blogTitleStyle}>{blog.title}</h3>
                <p style={blogAuthorStyle}>
                  By {blog.author?.firstName} {blog.author?.lastName}
                </p>
                <p style={blogStatusStyle}>
                  Status: <span style={statusBadgeStyle(blog.status)}>{blog.status}</span>
                </p>
                <p style={blogDateStyle}>
                  Created: {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isAuthenticated && (
        <div style={createBlogCardStyle}>
          <div style={createBlogContentStyle}>
            <h2 style={createBlogTitleStyle}>Want to Share Your Knowledge?</h2>
            <p style={createBlogTextStyle}>
              Join our community of developers and start sharing your coding insights today!
            </p>
            <button 
              onClick={() => navigate("/signin")} 
              style={createBlogButtonStyle}
            >
              Sign in to Create Blog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const containerStyle = {
  padding: "2rem",
  maxWidth: "1200px",
  margin: "0 auto",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "3rem",
};

const titleStyle = {
  fontSize: "2.5rem",
  color: "white",
  marginBottom: "1rem",
};

const subtitleStyle = {
  fontSize: "1.2rem",
  color: "#888",
};

const blogsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "2rem",
  marginBottom: "3rem",
};

const blogCardStyle = {
  backgroundColor: "#1f1f1f",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  transition: "transform 0.3s ease",
};

const imageContainerStyle = {
  width: "100%",
  height: "200px",
  overflow: "hidden",
};

const blogImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const blogContentStyle = {
  padding: "1.5rem",
};

const blogTitleStyle = {
  margin: "0 0 0.5rem 0",
  fontSize: "1.25rem",
  color: "white",
};

const blogAuthorStyle = {
  color: "#888",
  fontSize: "0.9rem",
  margin: "0.5rem 0",
};

const blogStatusStyle = {
  color: "#888",
  fontSize: "0.9rem",
  margin: "0.5rem 0",
};

const statusBadgeStyle = (status) => ({
  backgroundColor: status === "published" ? "#4caf50" : "#ff9800",
  color: "white",
  padding: "0.25rem 0.5rem",
  borderRadius: "4px",
  fontSize: "0.8rem",
  marginLeft: "0.5rem",
});

const blogDateStyle = {
  color: "#888",
  fontSize: "0.8rem",
  margin: "0.5rem 0",
};

const loadingStyle = {
  textAlign: "center",
  padding: "2rem",
  color: "white",
  fontSize: "1.2rem",
};

const errorStyle = {
  textAlign: "center",
  padding: "2rem",
  color: "#f44336",
  fontSize: "1.2rem",
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "4rem 2rem",
  backgroundColor: "#1f1f1f",
  borderRadius: "8px",
  marginBottom: "3rem",
};

const noBlogsStyle = {
  color: "#888",
  fontSize: "1.2rem",
};

const createBlogCardStyle = {
  backgroundColor: "#1f1f1f",
  borderRadius: "8px",
  padding: "2rem",
  marginTop: "2rem",
  textAlign: "center",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
};

const createBlogContentStyle = {
  maxWidth: "600px",
  margin: "0 auto",
};

const createBlogTitleStyle = {
  fontSize: "1.8rem",
  color: "white",
  marginBottom: "1rem",
};

const createBlogTextStyle = {
  color: "#888",
  fontSize: "1.1rem",
  marginBottom: "1.5rem",
  lineHeight: "1.6",
};

const createBlogButtonStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

export default Home; 