const express = require('express');
const router = express.Router();
const { createUser, deleteUser, updateAndSaveAccountType, updateAndSaveUserInfo, 
    updateAndSaveSite, createSite, deleteSite, createAccType, deleteAccType } = require('../controller/crudController');
const authenticateToken = require('../middleware/authToken');
const multer = require('multer');

// Configure multer for handling form data without files
const upload = multer();

//USER and UserInfo create delete
router.post('/createUser', authenticateToken, upload.none(), createUser);
router.put('/deleteUser/:id',authenticateToken, deleteUser);

//Update Save UserInfo, account Type and update Site
router.put('/updateUserInfo/:id', authenticateToken, upload.none(), updateAndSaveUserInfo);
router.put('/updateAccountType/:id', authenticateToken, upload.none(), updateAndSaveAccountType);
router.put('/updateSite/:id', authenticateToken, upload.none(), updateAndSaveSite);

//Site Create and Delete
router.post('/createSite', authenticateToken, upload.none(), createSite);
router.put('/deleteSite/:id',authenticateToken, deleteSite);

//AccType Create and Delete
router.post('/createAccType', authenticateToken, upload.none(), createAccType);
router.put('/deleteAccType/:id', authenticateToken, deleteAccType);

module.exports = router;
