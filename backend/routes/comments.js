const { userModel, blogModel, adminModel, commentsModel } = require("../db");
const mongoose = require("mongoose");

function commentsRouter(app) {
  // Add a comment to a blog post
  app.post("/posts/:postId/comments", async function (req, res) {
    try {
      const { postId } = req.params;
      const { name, email, content } = req.body;

      // Check if the blog exists
      const blog = await blogModel.findById(postId);
      if (!blog) {
        return res.status(404).json({ message: "Blog post not found." });
      }

      const newComment = new commentsModel({
        blog: postId,
        name,
        email,
        content,
      });

      await newComment.save();

      res.status(201).json({ message: "Comment added successfully.", comment: newComment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error adding comment.", error: err.message });
    }
  });

  // Get all comments for a specific blog post
  app.get("/posts/:postId/comments", async function (req, res) {
    try {
      const { postId } = req.params;

      const comments = await commentsModel.find({ blog: postId }).sort({ createdAt: -1 });

      res.status(200).json({ message: "Comments retrieved successfully.", comments });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error retrieving comments.", error: err.message });
    }
  });

  // Delete a specific comment by ID under a blog post
  app.delete("/posts/:postId/comments/:commentId", async function (req, res) {
    try {
      const { postId, commentId } = req.params;

      const comment = await commentsModel.findOneAndDelete({ _id: commentId, blog: postId });

      if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      res.status(200).json({ message: "Comment deleted successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting comment.", error: err.message });
    }
  });
}

module.exports = {
  commentsRouter,
};
