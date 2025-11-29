import userModel from "../models/userModel.js";

export const getUserData = async(req,res) => {
    try {
        const {userId}=req.body;

        const user=await userModel.findById(userId);

        if(!user) {
            return res.join({success:false,message: "User not found!"});
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                verified: user.isAccountVerified,
            }
        })
    }
    catch (error) {
        return res.join({success:false,message:error.message});
    }
}