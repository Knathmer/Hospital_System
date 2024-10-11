import express from 'express';
import authController from "../controllers/authController.js"; // .js needs to be added for ES modules
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

export default router; //standard form for ES module exports
