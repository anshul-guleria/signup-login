import express from 'express';
import { register, login, logged_out, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } from "../controllers/authController.js"
import userAuth from '../middleware/userAuth.js';

const authRouter=express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logged_out);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;