const express = require('express');
const router = express.Router();
const { login, getUserInfoByID } = require('../controller/authController');
const authenticateToken = require('../middleware/authToken')
const multer = require('multer');

// Configure multer for handling form data without files
const upload = multer();

// Authentication routes
router.post('/login', upload.none(), login);
router.get('/userinfo', authenticateToken, getUserInfoByID);

module.exports = router;
