import express from 'express';
import { register, login, logged_out, sendVerifyOtp, verifyEmail } from "../controllers/authController.js"
import userAuth from '../middleware/userAuth.js';

const authRouter=express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logged_out);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);

export default authRouter;