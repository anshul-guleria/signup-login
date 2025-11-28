import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async(req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.json({success: false, message: 'All fields are required'});
    }

    try {
        const existingUser=await userModel.findOne({email});
        if (existingUser) {
            return res.json({success: false, message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser=new userModel({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        
        //create a JWT token
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //Sending Welcome Email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Learning MERN stack authentication',
            text: `Welcome to my website ${name}. Thank you for registering ${email}`,
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true,message:"Sucessfully registered user"});

    }
    catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const login = async(req,res) => {
    const {email, password}=req.body;

    if(!email || !password) {
        return res.json({success: false, message: "Email and password are required."})
    }

    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false, message: "invalid email"});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({success: false, message: "Invalid Password"})
        }

        //create a JWT token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })



        return res.json({success: true,message:"Sucessfully logged in"});
    }
    catch(error) {
        return res.json({success: false, message: error.message});
    }
}

export const logged_out =  async(req,res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
        })

        return res.json({success: true, message:"Logged out"});
    }
    catch {
        return res.json({success: false, message: error.message});
    }
}

export const sendVerifyOtp = async(req, res) => {
    try {
        const {userId}=req.body;

        const user=await userModel.findById(userId);

        if(user.isAccountVerified) {
            return res.json({succes: false, message: "Account already verified"})
        }

        const otp = String(Math.floor(100000 + Math.random()*900000));

        user.verifyOtp=otp;
        user.verifyOtpExpiry = Date.now() + 24*60*60*1000;

        await user.save();

        const mailOptions= {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your otp is ${otp}. Verify your account using this otp`
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "OTP sent successfully."})
    }
    catch(error) {
        res.json({success: false, message: error.message});
    }
}

export const verifyEmail = async(req, res) => {
    const {userId, otp}=req.body;

    if(!userId || !otp) {
        return res.json({success: false, message:'missing details'});
    }   

    try {
        const user=await userModel.findById(userId);

        if(!user) {
            return res.json({success: false, message:"User not found"});
        }
        
        if(user.verifyOtp==='' || user.verifyOtp!==otp) {
            return res.json({success: false, message: 'Invalid OTP'})
        }

        if(user.verifyOtpExpiry < Date.now()) {
            return res.json({success:false, message:"OTP expired"});
        }

        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpiry=0;

        await user.save();

        return res.json({success: true, message: "Email verified successfully"});
    }
    catch(error) {
        return res.json({success: false, message: error.message});
    }
}

//check if user is authenticated
export const isAuthenticated = async(req,res) => {
    try {
        return res.json({success:true});
    }
    catch(error) {
        return res.json({success: false, error:error.message})
    }   
}

//send password reset otp
export const sendResetOtp = async(req,res) => {
    const {email}=req.body;

    if(!email) {
        return res.json({success:false, message:"Email is required!"})
    }

    try {
        const user=await userModel.findOne({email});

        if(!user) {
            return res.json({success:false, message:"User not found!"})    
        }
        
        const otp = String(Math.floor(100000 + Math.random()*900000));
        
        user.resetOtp=otp;
        user.resetOtpExpiry = Date.now() + 15*60*1000;

        await user.save();
        
        const mailOptions= {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset Password OTP',
            text: `Your otp is ${otp}. Use this OTP to proceed with resetting your password`
        }
        
        await transporter.sendMail(mailOptions);
        
        return res.json({success: true, message: "OTP sent successfully to your email."})
    }
    catch(error) {
        return res.json({success:false, message:error.message})
    }
}

export const resetPassword =async(req,res) => {
    const {email, otp, newPassword} =req.body;
    
    if(!email || !otp || !newPassword) {
        return res.json({success:false, message:"Email, Otp and new Password are required!"})
    }
    
    try {
        const user=await userModel.findOne({email})
        
        if(!user) {
            return res.json({success:false, message:"User not found!"})    
        }
        
        if(user.resetOtp==="" || user.resetOtp!==otp) {
            return res.json({success:false, message:"Invalid OTP"})    
        }
        
        if(user.resetOtpExpiry<Date.now()) {
            return res.json({success:false, message:"OTP expired"})    
        }

        const hashedPassword=await bcrypt.hash(newPassword,10);

        user.resetOtp="";
        user.resetOtpExpiry=0;
        user.password=hashedPassword;

        await user.save()

        return res.json({success:true, message:"Password changed successfully"})
    }
    catch(error) {
        return res.json({success:false, message:error.message})
    }
}