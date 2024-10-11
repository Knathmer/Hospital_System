const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login); //For when a log in request is sent from front end

router.post('/register', authController.register);

module.exports = router;