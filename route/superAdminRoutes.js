const express = require('express');
const router = express.Router();
const { getAllAcc, getAllAccType, getAllSite, getAccByID, getAccTypeByID, getSiteByID, getAllLogs } = require('../controller/superAdminController');
const authenticateToken = require('../middleware/authToken');

router.get('/accounts', authenticateToken, getAllAcc);
router.get('/accountTypes', authenticateToken, getAllAccType);
router.get('/sites', authenticateToken, getAllSite);

router.get('/accounts/:id', authenticateToken, getAccByID);
router.get('/accountTypes/:id', authenticateToken, getAccTypeByID);
router.get('/sites/:id', authenticateToken, getSiteByID);

router.get('/logs', authenticateToken, getAllLogs);

module.exports = router;
