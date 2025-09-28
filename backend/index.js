require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
//const { userModel, adminModel } = require("./db");

const app = express();


// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both possible Vite ports
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// Import routers
const { userRouter } = require("./routes/user");
const { blogRouter } = require("./routes/blog");
const { commentsRouter } = require("./routes/comments");
const { adminRouter } = require("./routes/admin");
const { likedislikeRouter } = require("./routes/likedislike");


// Register routes in order
userRouter(app);
adminRouter(app);
blogRouter(app);
commentsRouter(app);
likedislikeRouter(app);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

async function main() {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is not defined in .env file");
        }
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB successfully");
        app.listen(4000, () => {
            console.log("Server running on port 4000");
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

main();
