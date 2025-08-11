import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        // Fetch user profile data
        const profileResponse = await fetch("http://localhost:4000/user/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!profileResponse.ok) {
          if (profileResponse.status === 401) {
            localStorage.removeItem("token");
            navigate("/signin");
            throw new Error("Session expired. Please sign in again.");
          }
          throw new Error("Failed to fetch profile data");
        }

        const profileData = await profileResponse.json();
        setUserData(profileData.user);

        // Fetch user's blogs
        const blogsResponse = await fetch("http://localhost:4000/blog/posts", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!blogsResponse.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const blogsData = await blogsResponse.json();
        setBlogs(blogsData.posts || []);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div style={loadingStyle}>Loading profile...</div>;
  }

  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={profileCardStyle}>
        <h2 style={titleStyle}>Profile Information</h2>
        <div style={infoContainerStyle}>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Name:</span>
            <span style={valueStyle}>{userData?.firstName} {userData?.lastName}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Email:</span>
            <span style={valueStyle}>{userData?.email}</span>
          </div>
        </div>
      </div>

      <div style={blogsSectionStyle}>
        <h2 style={titleStyle}>My Blogs</h2>
        {blogs.length === 0 ? (
          <div style={emptyStateStyle}>
            <p style={noBlogsStyle}>You haven't created any blogs yet.</p>
            <button 
              onClick={() => navigate("/create")} 
              style={createButtonStyle}
            >
              Create Your First Blog
            </button>
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
                  <p style={blogStatusStyle}>
                    Status: <span style={statusBadgeStyle(blog.status)}>{blog.status}</span>
                  </p>
                                  <p style={blogDateStyle}>
                  Created: {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                {blog.content && (
                  <p style={blogPreviewStyle}>
                    {blog.content.length > 150 
                      ? `${blog.content.substring(0, 150)}...` 
                      : blog.content
                    }
                  </p>
                )}
                <div style={blogActionsStyle}>
                  <button 
                    onClick={() => navigate(`/edit/${blog._id}`)} 
                    style={editButtonStyle}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => navigate(`/blog/${blog._id}`)} 
                    style={viewButtonStyle}
                  >
                    View
                  </button>
                </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  padding: "2rem",
  maxWidth: "1200px",
  margin: "0 auto",
};

const profileCardStyle = {
  backgroundColor: "#1f1f1f",
  borderRadius: "8px",
  padding: "2rem",
  marginBottom: "2rem",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
};

const titleStyle = {
  color: "white",
  fontSize: "1.8rem",
  marginBottom: "1.5rem",
};

const infoContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const infoRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const labelStyle = {
  color: "#888",
  fontSize: "1.1rem",
  minWidth: "100px",
};

const valueStyle = {
  color: "white",
  fontSize: "1.1rem",
};

const blogsSectionStyle = {
  marginTop: "2rem",
};

const blogsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "2rem",
};

const blogCardStyle = {
  backgroundColor: "#1f1f1f",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
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

const blogPreviewStyle = {
  color: "#e0e0e0",
  fontSize: "0.95rem",
  lineHeight: "1.5",
  margin: "1rem 0",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const blogActionsStyle = {
  display: "flex",
  gap: "1rem",
  marginTop: "1rem",
};

const editButtonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#2196f3",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  flex: 1,
};

const viewButtonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#4caf50",
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
};

const noBlogsStyle = {
  color: "#888",
  fontSize: "1.2rem",
  marginBottom: "1.5rem",
};

const createButtonStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
};

export default Profile; 