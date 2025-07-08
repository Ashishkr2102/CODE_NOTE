const jwt=require("jsonwebtoken");
const{JWT_ADMIN_PASSWORD}=require("../db")
function addminMiddleware(req,res,next){
    const token=req.header.token;
    const decoded=jwt.verify(token,JWT_ADMIN_PASSWORD);
    if(decoded){
        req.adminID=decoded.id;
        next();
    }
    else{
        res.status(403).json({
            message:"You are not signed in"
        })
    }
}
module.exports={
    addminMiddleware:addminMiddleware
}