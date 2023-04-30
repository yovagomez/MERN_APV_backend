import jwt from "jsonwebtoken";
import Vet from "../models/Vet.js"

const checkAuth = async (req, res, next) => {
    let token;
     //Check if the token is being sent by the user
     if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Catch only the token without the "Bearer" word
            token = req.headers.authorization.split(" ")[1];
            // Token verify with jwt
            const decoded  = jwt.verify(token, process.env.JWT_SECRET);

            req.vet = await Vet.findById(decoded.id).select("-password -token -confirmed");
            return next();
        } catch (error) {
           const e = new Error("Invalid Token");
           return res.status(403).json({msg: e.message});
        }
     }

     if(!token) {
        const error = new Error("Invalid Token or non-existent");
        return res.status(403).json({msg: error.message});
     }

    next();
};

export default checkAuth;