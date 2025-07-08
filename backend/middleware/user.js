const jwt=require("jsonwebtoken");
const{JWT_USER_PASSWORD}=require("../config");

function userMiddleware(req,res,next){
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "No token provided. Please sign in first."
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_USER_PASSWORD);
        
        if(decoded){
            req.userID = decoded.id;
            next();
        } else {
            res.status(403).json({
                message: "Invalid token. Please sign in again."
            });
        }
    } catch (error) {
        return res.status(401).json({
            message: "Authentication failed. Please sign in again."
        });
    }
}

module.exports={
    userMiddleware:userMiddleware
}