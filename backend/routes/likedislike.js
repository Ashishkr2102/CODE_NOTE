const { blogModel } = require("../db");

function likedislikeRouter(app) {
  // Like a post
  app.post("/blog/:postId/like", async (req, res) => {
    try {
      const { postId } = req.params;

      // Find the blog post
      const blog = await blogModel.findById(postId);
      if (!blog) {
        return res.status(404).json({ message: "Blog post not found." });
      }

      // Increment the like count
      blog.like = (blog.like || 0) + 1;

      // Save
      await blog.save();

      res.status(200).json({
        message: "Liked the post successfully.",
        likes: blog.like,
        dislikes: blog.dislike || 0,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error liking the post.", error: err.message });
    }
  });

  // Dislike a post
  app.post("/blog/:postId/dislike", async (req, res) => {
    try {
      const { postId } = req.params;

      // Find the blog post
      const blog = await blogModel.findById(postId);
      if (!blog) {
        return res.status(404).json({ message: "Blog post not found." });
      }

      // Increment the dislike count
      blog.dislike = (blog.dislike || 1) + 1;

      // Save
      await blog.save();

      res.status(200).json({
        message: "Disliked the post successfully.",
        likes: blog.like || 0,
        dislikes: blog.dislike,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error disliking the post.", error: err.message });
    }
  });
}

module.exports = { likedislikeRouter };
