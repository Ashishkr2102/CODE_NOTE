const { userModel,adminModel,blogModel } = require("../db");
const jwt=require("jsonwebtoken");
const {JWT_USER_PASSWORD}=require("../config");
const { userMiddleware } = require("../middleware/user");
const bcrypt = require('bcrypt');
const { userSignupSchema } = require('../validations/auth');

function userRouter(app) {

   // console.log("User routes loaded ✅"); // Add this to confirm it's being called

    app.post("/user/signup", async function (req, res) {
        try {
            // Validate input using Zod
            const validatedData = userSignupSchema.parse(req.body);
            
            // Hash the password
            const hashedPassword = await bcrypt.hash(validatedData.password, 10);

            // Create the user with hashed password
            const newUser = await userModel.create({
                email: validatedData.email,
                password: hashedPassword,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
            });

            // Remove password from response
            const userResponse = {
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                _id: newUser._id
            };

            res.status(201).json({
                message: "User signed up successfully",
                user: userResponse
            });
        } catch (e) {
            if (e.name === 'ZodError') {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: e.errors
                });
            }
            console.error("Error creating user:", e);
            res.status(500).json({
                message: "Error signing up user",
                error: e.message
            });
        }
    });

    app.post("/user/signin", async function (req, res) {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        try {
            const user = await userModel.findOne({ email: email });

            if (!user) {
                return res.status(401).json({
                    message: "No account found with this email"
                });
            }

            // Compare password with hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);
            
            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Incorrect password"
                });
            }

            const token = jwt.sign({
                id: user._id,
                email: user.email
            }, JWT_USER_PASSWORD, { expiresIn: '24h' });

            res.json({
                message: "Successfully signed in",
                token: token,
                user: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    _id: user._id
                }
            });
        } catch (e) {
            console.error("Error during user signin:", e);
            res.status(500).json({
                message: "Error signing in",
                error: process.env.NODE_ENV === 'development' ? e.message : 'Internal server error'
            });
        }
    });

    app.post("/user/signout", userMiddleware, function (req, res) {
        res.json({
            message: "User logged out"
        });
    });

    app.get("/user/blog", userMiddleware, async function (req, res) {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        try {
            const user = await userModel.findOne({ email: email });
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const blogs = await blogModel.find({ author: user._id });

            res.status(200).json({
                blogs: blogs
            });
        } catch (e) {
            console.error("Error fetching blogs:", e);
            res.status(500).json({
                message: "Error fetching blogs",
                error: e.message
            });
        }
    });

    app.get("/user/profile", userMiddleware, async function (req, res) {
        try {
            // Get user ID from the token (set by userMiddleware)
            const userId = req.userID;
            if (!userId) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            // Fetch user data from database
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            // Get user's blogs
            const blogs = await blogModel.find({ author: userId });

            res.status(200).json({
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                },
                blogs: blogs
            });
        } catch (e) {
            console.error("Error fetching profile:", e);
            res.status(500).json({
                message: "Error fetching profile data",
                error: e.message
            });
        }
    });
}

module.exports = {
    userRouter: userRouter
};
