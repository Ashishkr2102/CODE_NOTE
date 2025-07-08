const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  firstName: String,
  lastName: String,
});

const adminSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  firstName: String,
  lastName: String,
});

const blogSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Ensure "user" matches the model name
    title: String, // Fixed typo from 'tile' to 'title'
    content: String,
    coverImage: String,
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
  },
  { timestamps: true } // This will automatically handle createdAt and updatedAt fields
);

const commentsSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "blog" },
  name: String,
  email: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const commentsModel = mongoose.model("comments", commentsSchema);
const blogModel = mongoose.model("blog", blogSchema);
const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);

module.exports = {
  userModel,
  adminModel,
  blogModel,
  commentsModel,
};
