import jwt from "jsonwebtoken";

export const authMiddleware=(req,res,next)=>{
    try{

        const authHeader=req.headers.authorization;

        console.log("AUTH HEADER:",authHeader);

        if(!authHeader){
            return res.status(401).json({
                message:"No Authorization header found"
            });
        }

        const token=authHeader.split(" ")[1];

        console.log("TOKEN EXISTS:",!!token);

        if(!token){
            return res.status(401).json({
                message:"Invalid token"
            });
        }

        const decodedToken=jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("AUTH USER:",decodedToken);

        req.user=decodedToken;

        next();

    }catch(error){

        console.log("JWT ERROR:",error.message);

        return res.status(401).json({
            message:"Unauthorized access"
        });

    }
};