const express = require('express');
const router = express.Router();
const { createUser, deleteUser } = require('../controller/userController');

// User routes
router.post('/create', createUser);
router.put('/delete/:id', deleteUser);

module.exports = router;
