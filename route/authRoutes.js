const express = require('express');
const router = express.Router();
const { login, getUserInfo } = require('../controller/authController');
const authenticateToken = require('../middleware/authToken')

// Authentication routes
router.post('/login', login);
router.get('/userinfo', authenticateToken, getUserInfo);

module.exports = router;
