import express from 'express';
import authController from "../controllers/authController";
const router = express.Router();

router.post('/login', authController.login); //For when a log in request is sent from front end

export default router;