import jwt from "jsonwebtoken";

export const authMiddleware = (req,res,next)=>{
    try{
        const AuthHeader = req.headers.authorization;
        if(!AuthHeader){
            return res.status(401).json({
                message:"No Authorization header found"
            })
        }
        const token = AuthHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"Invalid token"});
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    }catch(error){
        return res.status(401).json({
            message:"Unauthorized access"
        })
    }
}