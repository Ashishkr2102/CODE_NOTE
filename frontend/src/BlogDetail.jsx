import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function BlogDetail() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  // Comments
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch blog + comments
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:4000/blog/${id}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error("Blog not found");
          throw new Error("Failed to fetch blog");
        }
        const data = await response.json();
        setBlog(data.post);
        setLikes(data.post.like || 0);
        setDislikes(data.post.dislike || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:4000/posts/${id}/comments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlog();
    fetchComments();
  }, [id]);

  // Like handler
  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:4000/blog/${id}/like`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setLikes(data.likes);
        setDislikes(data.dislikes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dislike handler
  const handleDislike = async () => {
    try {
      const res = await fetch(`http://localhost:4000/blog/${id}/dislike`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setLikes(data.likes);
        setDislikes(data.dislikes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:4000/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentForm),
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [data.comment, ...prev]);
        setCommentForm({ name: "", email: "", content: "" });
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

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
              <span style={statusBadgeStyle(blog.status)}>{blog.status}</span>
            </div>
          </header>

          <div style={blogBodyStyle}>
            {blog.content.split("\n").map((paragraph, index) => (
              <p key={index} style={paragraphStyle}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Like/Dislike */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <button onClick={handleLike} style={likeButtonStyle}>
              👍 Like ({likes})
            </button>
            <button onClick={handleDislike} style={dislikeButtonStyle}>
              👎 Dislike ({dislikes})
            </button>
          </div>

          {/* Comments Section */}
          <div style={{ marginTop: "3rem" }}>
            <h2 style={{ color: "white" }}>Comments</h2>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} style={{ marginBottom: "2rem" }}>
              <input
                type="text"
                placeholder="Name"
                value={commentForm.name}
                onChange={(e) =>
                  setCommentForm({ ...commentForm, name: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email"
                value={commentForm.email}
                onChange={(e) =>
                  setCommentForm({ ...commentForm, email: e.target.value })
                }
                required
                style={inputStyle}
              />
              <textarea
                placeholder="Your comment..."
                value={commentForm.content}
                onChange={(e) =>
                  setCommentForm({ ...commentForm, content: e.target.value })
                }
                required
                style={textareaStyle}
              />
              <button type="submit" style={submitButtonStyle} disabled={submitting}>
                {submitting ? "Submitting..." : "Add Comment"}
              </button>
            </form>

            {/* Comments List */}
            {comments.length === 0 ? (
              <p style={{ color: "#aaa" }}>No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c._id}
                  style={{
                    background: "#2a2a2a",
                    padding: "1rem",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                  }}
                >
                  <p style={{ color: "white", marginBottom: "0.5rem" }}>
                    <strong>{c.name}</strong> ({c.email})
                  </p>
                  <p style={{ color: "#ccc" }}>{c.content}</p>
                  <p style={{ color: "#777", fontSize: "0.8rem" }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

// ---- Existing Styles (kept intact) ----
const containerStyle = { padding: "2rem", maxWidth: "800px", margin: "0 auto" };
const backButtonStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "1rem",
  cursor: "pointer",
  marginBottom: "2rem",
};
const blogContainerStyle = {
  backgroundColor: "#1f1f1f",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
};
const imageContainerStyle = { width: "100%", height: "300px", overflow: "hidden" };
const blogImageStyle = { width: "100%", height: "100%", objectFit: "cover" };
const blogContentStyle = { padding: "2rem" };
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
const blogAuthorStyle = { color: "#888", fontSize: "1.1rem", margin: 0 };
const blogDateStyle = { color: "#888", fontSize: "1rem", margin: 0 };
const statusBadgeStyle = (status) => ({
  backgroundColor: status === "published" ? "#4caf50" : "#ff9800",
  color: "white",
  padding: "0.25rem 0.75rem",
  borderRadius: "20px",
  fontSize: "0.9rem",
  fontWeight: "500",
});
const blogBodyStyle = { lineHeight: "1.8" };
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
const errorContainerStyle = { textAlign: "center", padding: "4rem 2rem" };
const errorStyle = { color: "#f44336", fontSize: "1.2rem", marginBottom: "2rem" };
const likeButtonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const dislikeButtonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  marginBottom: "1rem",
  borderRadius: "4px",
  border: "1px solid #444",
  background: "#2a2a2a",
  color: "white",
};
const textareaStyle = {
  width: "100%",
  padding: "0.75rem",
  marginBottom: "1rem",
  borderRadius: "4px",
  border: "1px solid #444",
  background: "#2a2a2a",
  color: "white",
  minHeight: "100px",
};
const submitButtonStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#2196f3",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default BlogDetail;
