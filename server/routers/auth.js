import express from 'express';
import { login, register } from "../controllers/authController.js"; // Named imports

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

export default router;
