import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateBlog() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft" // default status
  });
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        setError("Image size should be less than 1MB");
        return;
      }
      setCoverImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please sign in to create a blog");
      }

      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("status", formData.status);
      if (coverImage) {
        formDataToSend.append("coverImage", coverImage);
      }

      const response = await fetch("http://localhost:4000/blog/posts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
          throw new Error("Session expired. Please sign in again.");
        }
        throw new Error(data.message || "Failed to create blog");
      }

      // Redirect to home page after successful creation
      navigate("/");
    } catch (err) {
      console.error("Error creating blog:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={titleStyle}>Create New Blog</h2>
        
        {error && <div style={errorStyle}>{error}</div>}

        <div style={inputGroupStyle}>
          <input 
            type="text" 
            name="title"
            placeholder="Blog Title" 
            style={inputStyle}
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div style={inputGroupStyle}>
          <textarea 
            name="content"
            placeholder="Write your blog content here..."
            style={textareaStyle}
            value={formData.content}
            onChange={handleChange}
            required
            rows={10}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Cover Image (optional, max 1MB)</label>
          <input 
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={fileInputStyle}
          />
          {coverImage && (
            <div style={previewStyle}>
              <img 
                src={URL.createObjectURL(coverImage)} 
                alt="Cover preview" 
                style={previewImageStyle}
              />
            </div>
          )}
        </div>

        <div style={inputGroupStyle}>
          <select 
            name="status"
            style={selectStyle}
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button 
          type="submit" 
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Blog"}
        </button>
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
  maxWidth: "800px",
  padding: "2rem",
  backgroundColor: "#1f1f1f",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const titleStyle = {
  textAlign: "center",
  color: "white",
  marginBottom: "2rem",
  fontSize: "2rem",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "1.5rem",
};

const inputStyle = {
  padding: "0.75rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #444",
  backgroundColor: "#333",
  color: "white",
  outline: "none",
  transition: "border-color 0.3s ease",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "200px",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

const buttonStyle = {
  width: "100%",
  padding: "1rem",
  fontSize: "1.1rem",
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
  marginBottom: "1.5rem",
  textAlign: "center",
  fontSize: "1rem",
  padding: "0.75rem",
  backgroundColor: "rgba(255, 68, 68, 0.1)",
  borderRadius: "4px",
};

const labelStyle = {
  color: "white",
  marginBottom: "0.5rem",
  fontSize: "0.9rem",
};

const fileInputStyle = {
  ...inputStyle,
  padding: "0.5rem",
  cursor: "pointer",
};

const previewStyle = {
  marginTop: "1rem",
  maxWidth: "300px",
};

const previewImageStyle = {
  width: "100%",
  height: "auto",
  borderRadius: "4px",
};

export default CreateBlog; 