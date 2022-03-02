import express from 'express';
import { signUp, signIn } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/sign-in', signIn);
authRouter.post('/sign-up', signUp);

export default authRouter;
