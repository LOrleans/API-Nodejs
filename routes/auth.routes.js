import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { userValidationRules, loginValidationRules } from '../middlewares/validators.js';

const router = express.Router();

router.post('/register', userValidationRules(), registerUser);
router.post('/login', loginValidationRules(), loginUser);

export default router;
