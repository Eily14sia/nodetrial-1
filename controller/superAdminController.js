// Import necessary models or functions
const { UserInfo, AccountType, Site, LogMaster} = require('../models/database');

// Controller function to get all accounts
async function getAllAcc(req, res) {
  try {
    const allAccounts = await UserInfo.findAll();
    res.json(allAccounts);
  } catch (error) {
    console.error('Error getting all accounts:', error);
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to get all account types
async function getAllAccType(req, res) {
  try {
    const allAccountTypes = await AccountType.findAll();
    res.json(allAccountTypes);
  } catch (error) {
    console.error('Error getting all account types:', error);
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to get all sites
async function getAllSite(req, res) {
  try {
    const allSites = await Site.findAll();
    res.json(allSites);
  } catch (error) {
    console.error('Error getting all sites:', error);
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to get account by ID
async function getAccByID(req, res) {
  const accountId = req.params.id; 

  try {
    const account = await UserInfo.findByPk(accountId);
    if (!account) {
      return res.status(404).json({ resultKey: false, errorMessage: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    console.error('Error getting account by ID:', error);
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to get account type by ID
async function getAccTypeByID(req, res) {
  const accTypeId = req.params.id; // ID passed in the route

  try {
    const accType = await AccountType.findByPk(accTypeId);
    if (!accType) {
      return res.status(404).json({ resultKey: false, errorMessage: 'Account type not found' });
    }
    res.json(accType);
  } catch (error) {
    console.error('Error getting account type by ID:', error);
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to get site by ID
async function getSiteByID(req, res) {
  const siteId = req.params.id; // ID passed in the route

  try {
    const site = await Site.findByPk(siteId);
    if (!site) {
      return res.status(404).json({ resultKey: false, errorMessage: 'Site not found' });
    }
    res.json(site);
  } catch (error) {
    console.error('Error getting site by ID:', error);
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to get All Logs
async function getAllLogs(req, res) {
    try {
      const allLogs = await LogMaster.findAll();
      res.json(allLogs);
    } catch (error) {
      console.error('Error getting all logs:', error);
      res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
    }
  }

module.exports = { getAllAcc, getAllAccType, getAllSite, getAccByID, getAccTypeByID, getSiteByID, getAllLogs };
