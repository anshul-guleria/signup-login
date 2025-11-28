import express from 'express';
import { register, login, logged_out } from "../controllers/authController.js"

const authRouter=express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logged_out);

export default authRouter;