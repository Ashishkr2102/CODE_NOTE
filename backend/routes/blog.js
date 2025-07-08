const { blogModel } = require("../db"); // Corrected import
const { addminMiddleware } = require("../middleware/admin");
const { userMiddleware } = require("../middleware/user");
const upload = require("../middleware/multer");

function blogRouter(app) {
  // Get all blog posts
  app.get("/blog/all", async function (req, res) {
    try {
      const posts = await blogModel.find()
        .populate('author', 'firstName lastName')
        .sort({ createdAt: -1 });
      
      res.json(posts);
    } catch (e) {
      res.status(500).json({
        message: "Error retrieving posts",
        error: e.message,
      });
    }
  });

  // Create blog post with image upload
  app.post("/blog/posts", userMiddleware, upload.single('coverImage'), async function (req, res) {
    const { title, content, status } = req.body;
    const coverImage = req.file ? `/uploads/blog/${req.file.filename}` : null;

    try {
      // Get user ID from the token (set by userMiddleware)
      const userId = req.userID;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const newBlog = await blogModel.create({
        author: userId, // Set author to the authenticated user's ID
        title,
        content,
        coverImage,
        status,
        updatedAt: new Date(),
      });

      // Populate author information before sending response
      const populatedBlog = await blogModel.findById(newBlog._id)
        .populate('author', 'firstName lastName');

      res.status(201).json({
        message: "Blog post created successfully",
        blog: populatedBlog,
      });
    } catch (e) {
      res.status(500).json({
        message: "Error creating blog post",
        error: e.message,
      });
    }
  });

  // Get all blog posts by specific author
  app.get("/blog/posts", userMiddleware, async function (req, res) {
    try {
      // Get user ID from the token (set by userMiddleware)
      const userId = req.userID;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const posts = await blogModel.find({ author: userId })
        .populate('author', 'firstName lastName')
        .sort({ createdAt: -1 });

      res.json({
        message: "Fetched blog posts by user",
        posts: posts
      });
    } catch (e) {
      res.status(500).json({
        message: "Error retrieving posts",
        error: e.message
      });
    }
  });
  
  // Get a specific blog post by ID
  app.get("/blog/:postId", async function (req, res) {
    const postId = req.params.postId;

    try {
      const post = await blogModel.findById(postId)
        .populate('author', 'firstName lastName');
        
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({
        message: "Fetched specific post",
        post: post,
      });
    } catch (e) {
      res.status(500).json({
        message: "Error retrieving post",
        error: e.message,
      });
    }
  });

  // Update a blog post with image upload
  app.put("/blog/:postId", userMiddleware, upload.single('coverImage'), async function (req, res) {
    const postId = req.params.postId;
    const { tile, content, status } = req.body;
    const coverImage = req.file ? `/uploads/blog/${req.file.filename}` : undefined;

    try {
      const updateData = {
        tile,
        content,
        status,
        updatedAt: new Date()
      };

      if (coverImage) {
        updateData.coverImage = coverImage;
      }

      const updatedPost = await blogModel.findByIdAndUpdate(
        postId,
        updateData,
        { new: true }
      ).populate('author', 'firstName lastName');

      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json({
        message: "Blog post updated successfully",
        blog: updatedPost,
      });
    } catch (e) {
      res.status(500).json({
        message: "Error updating blog post",
        error: e.message,
      });
    }
  });

  // Delete a blog post
  app.delete("/blog/:postId", userMiddleware, async function (req, res) {
    const postId = req.params.postId;

    try {
      const deletedPost = await blogModel.findByIdAndDelete(postId);
      if (!deletedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({
        message: "Blog post deleted successfully",
      });
    } catch (e) {
      res.status(500).json({
        message: "Error deleting blog post",
        error: e.message,
      });
    }
  });
}

module.exports = {
  blogRouter: blogRouter,
};
