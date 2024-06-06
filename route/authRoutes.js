const express = require('express');
const router = express.Router();
const { login, getUserInfoByID } = require('../controller/authController');
const authenticateToken = require('../middleware/authToken')

// Authentication routes
router.post('/login', login);
router.get('/userinfo', authenticateToken, getUserInfoByID);

module.exports = router;
