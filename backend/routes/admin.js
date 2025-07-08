const { adminModel, userModel, blogModel, commentsModel }=require("../db");
const jwt=require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD}=require("../config");
const bcrypt = require('bcrypt');
const { adminSignupSchema } = require('../validations/auth');

// Special token for admin signup
const ADMIN_SPECIAL_TOKEN = "123456789";

function adminRouter(app){
    app.post("/admin/signup",async function(req,res){
        try {
            const { specialToken, ...signupData } = req.body;

            // Validate special token
            if (specialToken !== ADMIN_SPECIAL_TOKEN) {
                return res.status(401).json({
                    message: "Invalid special token. Admin signup failed."
                });
            }

            // Validate input using Zod
            const validatedData = adminSignupSchema.parse(signupData);
            
            // Hash the password
            const hashedPassword = await bcrypt.hash(validatedData.password, 10);

            const newAdmin = await adminModel.create({
                email: validatedData.email,
                password: hashedPassword,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName
            });

            // Remove password from response
            const adminResponse = {
                email: newAdmin.email,
                firstName: newAdmin.firstName,
                lastName: newAdmin.lastName,
                _id: newAdmin._id
            };

            res.status(201).json({
                message: "admin signedup successfully",
                admin: adminResponse
            });
        } catch(e) {
            if (e.name === 'ZodError') {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: e.errors
                });
            }
            console.error("Error in admin signup:", e);
            res.status(500).json({
                message: "Error in admin signup",
                error: e.message
            });
        }
    });

    app.post("/admin/signin", async function(req, res) {
        const { email, password } = req.body;
        try {
            const admin = await adminModel.findOne({ email: email });
    
            if (!admin) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            // Compare password with hashed password
            const passwordMatch = await bcrypt.compare(password, admin.password);
            
            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const token = jwt.sign({
                id: admin._id
            }, JWT_ADMIN_PASSWORD);

            res.json({
                message: "admin signedin",
                token: token
            });
        } catch (e) {
            console.error("Error during admin signin:", e);
            res.status(500).json({
                message: "Error signing in admin",
                error: e.message
            });
        }
    });

    app.get("/admin/finduser/profile", async function (req, res) {
        try {
            const users = await userModel.find();
            res.status(200).json({
                message: "All user profiles fetched successfully",
                users: users
            });
        } catch (e) {
            console.error("Error fetching user profiles:", e);
            res.status(500).json({
                message: "Error fetching user profiles",
                error: e.message
            });
        }
    });

    app.put("/admin/update/profile", async function (req, res) {
        const { email } = req.body;
    
        try {
            const user = await userModel.findOne({ email: email });
    
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
    
            const newAdmin = await adminModel.create({
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName
            });
    
            res.status(200).json({
                message: "User promoted to admin successfully",
                admin: newAdmin
            });
        } catch (e) {
            console.error("Error promoting user:", e);
            res.status(500).json({
                message: "Error promoting user",
                error: e.message
            });
        }
    });
    app.delete("/admin/users/:userId", async function(req, res) {
        try {
            const { userId } = req.params;

            // Find the user first to check if they exist
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            // Delete all blogs associated with this user
            await blogModel.deleteMany({ author: userId });

            // Delete all comments associated with this user's blogs
            const userBlogs = await blogModel.find({ author: userId });
            const blogIds = userBlogs.map(blog => blog._id);
            await commentsModel.deleteMany({ blog: { $in: blogIds } });

            // Delete the user
            await userModel.findByIdAndDelete(userId);

            res.status(200).json({
                message: "User and all associated data deleted successfully"
            });
        } catch (e) {
            console.error("Error deleting user:", e);
            res.status(500).json({
                message: "Error deleting user",
                error: e.message
            });
        }
    });
  
    app.delete("/admin/posts/:postId",function(req,res){
        res.json({
            message:"Force delete a post"
        })
    })
}
module.exports={
    adminRouter:adminRouter
}