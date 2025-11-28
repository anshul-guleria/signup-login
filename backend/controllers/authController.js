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