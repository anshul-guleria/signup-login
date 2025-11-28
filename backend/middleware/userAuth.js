import jwt from "jsonwebtoken";

const userAuth = async(req,res,next) => {
    const {token}=req.cookies;
    
    if(!token) {
         return res.json({success:false, message: "Not authorized, Login again!!"})
    }

    try {

        const token_decoded=jwt.verify(token, process.env.JWT_SECRET);
        if(token_decoded.id) {
            req.body=req.body || {};
            req.body.userId=token_decoded.id;
            // return res.json({"id":token_decoded.id})
        }
        else {
            return res.json({success:false, message: "Not authorized, Login again!!"});
        }

        next();
    }
    catch(error) {
        res.json({success: false, message:error.message})
    }
}

export default userAuth;