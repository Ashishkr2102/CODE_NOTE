const { blogModel } = require("../db");

function likedislikeRouter(app) {
  // Like a post
  app.post("/posts/:postId/like", async function (req, res) {
    try {
      const { postId } = req.params;

      // Find the blog post
      const blog = await blogModel.findById(postId);
      if (!blog) {
        return res.status(404).json({ message: "Blog post not found." });
      }

      // Increment the like count
      blog.like += 1;

      // Save the updated blog post
      await blog.save();

      res.status(200).json({
        message: "Liked the post successfully.",
        likeCount: blog.like,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Error liking the post.",
        error: err.message,
      });
    }
  });

  // Dislike a post
  app.post("/posts/:postId/dislike", async function (req, res) {
    try {
      const { postId } = req.params;

      // Find the blog post
      const blog = await blogModel.findById(postId);
      if (!blog) {
        return res.status(404).json({ message: "Blog post not found." });
      }

      // Increment the dislike count
      blog.dislike += 1;

      // Save the updated blog post
      await blog.save();

      res.status(200).json({
        message: "Disliked the post successfully.",
        dislikeCount: blog.dislike,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Error disliking the post.",
        error: err.message,
      });
    }
  });
}

module.exports = {
  likedislikeRouter,
};
