import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function BlogDetail() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:4000/blog/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Blog not found");
          }
          throw new Error("Failed to fetch blog");
        }
        const data = await response.json();
        setBlog(data.post);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <div style={loadingStyle}>Loading blog...</div>;
  }

  if (error) {
    return (
      <div style={errorContainerStyle}>
        <div style={errorStyle}>{error}</div>
        <button onClick={() => navigate("/")} style={backButtonStyle}>
          Back to Home
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={errorContainerStyle}>
        <div style={errorStyle}>Blog not found</div>
        <button onClick={() => navigate("/")} style={backButtonStyle}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate("/")} style={backButtonStyle}>
        ← Back to Home
      </button>
      
      <article style={blogContainerStyle}>
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
          <header style={blogHeaderStyle}>
            <h1 style={blogTitleStyle}>{blog.title}</h1>
            <div style={blogMetaStyle}>
              <p style={blogAuthorStyle}>
                By {blog.author?.firstName} {blog.author?.lastName}
              </p>
              <p style={blogDateStyle}>
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <span style={statusBadgeStyle(blog.status)}>
                {blog.status}
              </span>
            </div>
          </header>
          
          <div style={blogBodyStyle}>
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} style={paragraphStyle}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

// Styles
const containerStyle = {
  padding: "2rem",
  maxWidth: "800px",
  margin: "0 auto",
};

const backButtonStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "1rem",
  cursor: "pointer",
  marginBottom: "2rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
};

const blogContainerStyle = {
  backgroundColor: "#1f1f1f",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
};

const imageContainerStyle = {
  width: "100%",
  height: "300px",
  overflow: "hidden",
};

const blogImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const blogContentStyle = {
  padding: "2rem",
};

const blogHeaderStyle = {
  marginBottom: "2rem",
  borderBottom: "1px solid #333",
  paddingBottom: "1rem",
};

const blogTitleStyle = {
  fontSize: "2.5rem",
  color: "white",
  margin: "0 0 1rem 0",
  lineHeight: "1.2",
};

const blogMetaStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  alignItems: "center",
};

const blogAuthorStyle = {
  color: "#888",
  fontSize: "1.1rem",
  margin: 0,
};

const blogDateStyle = {
  color: "#888",
  fontSize: "1rem",
  margin: 0,
};

const statusBadgeStyle = (status) => ({
  backgroundColor: status === "published" ? "#4caf50" : "#ff9800",
  color: "white",
  padding: "0.25rem 0.75rem",
  borderRadius: "20px",
  fontSize: "0.9rem",
  fontWeight: "500",
});

const blogBodyStyle = {
  lineHeight: "1.8",
};

const paragraphStyle = {
  color: "#e0e0e0",
  fontSize: "1.1rem",
  margin: "0 0 1.5rem 0",
  textAlign: "justify",
};

const loadingStyle = {
  textAlign: "center",
  padding: "4rem 2rem",
  color: "white",
  fontSize: "1.2rem",
};

const errorContainerStyle = {
  textAlign: "center",
  padding: "4rem 2rem",
};

const errorStyle = {
  color: "#f44336",
  fontSize: "1.2rem",
  marginBottom: "2rem",
};

export default BlogDetail;
