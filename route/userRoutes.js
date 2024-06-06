const express = require('express');
const router = express.Router();
const { createUser, deleteUser } = require('../controller/userController');
const authenticateToken = require('../middleware/authToken');
const multer = require('multer');

// Configure multer for handling form data without files
const upload = multer();

// User routes with authentication middleware for handling form data without files
router.post('/create', authenticateToken, upload.none(), createUser);
router.put('/delete/:id', deleteUser);

module.exports = router;
