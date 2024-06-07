// Import necessary models or functions
const { sequelize, UserInfo, AccountType, Site, LogMaster } = require('../models/database');
const logger = require('../utils/logger');


// Controller function to get all accounts
async function getAllAcc(req, res) {
  try {
    const allAccounts = await UserInfo.findAll();
    res.json(allAccounts);
  } catch (error) {
    logger.error(`Error getting all accounts: ${error.message}`, { stack: error.stack });
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to get all account types
async function getAllAccType(req, res) {
  try {
    const allAccountTypes = await AccountType.findAll();
    res.json(allAccountTypes);
  } catch (error) {
    logger.error(`Error getting all account types: ${error.message}`, { stack: error.stack });
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to get all sites
async function getAllSite(req, res) {
  try {
    const allSites = await Site.findAll();
    res.json(allSites);
  } catch (error) {
    logger.error(`Error getting all sites: ${error.message}`, { stack: error.stack });
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
    logger.error(`Error getting account by ID: ${error.message}`, { stack: error.stack });
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to get account type by ID
async function getAccTypeByID(req, res) {
  const accTypeId = req.params.id;

  try {
    const accType = await AccountType.findByPk(accTypeId);
    if (!accType) {
      return res.status(404).json({ resultKey: false, errorMessage: 'Account type not found' });
    }
    res.json(accType);
  } catch (error) {
    logger.error(`Error getting account type by ID: ${error.message}`, { stack: error.stack });
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to get site by ID
async function getSiteByID(req, res) {
  const siteId = req.params.id;

  try {
    const site = await Site.findByPk(siteId);
    if (!site) {
      return res.status(404).json({ resultKey: false, errorMessage: 'Site not found' });
    }
    res.json(site);
  } catch (error) {
    logger.error(`Error getting site by ID: ${error.message}`, { stack: error.stack });
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to get all logs
async function getAllLogs(req, res) {
  try {
    const allLogs = await LogMaster.findAll();
    res.json(allLogs);
  } catch (error) {
    logger.error(`Error getting all logs: ${error.message}`, { stack: error.stack });
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to update and save user info with transaction rollbacks
async function updateAndSaveUserInfo(req, res) {
  const user_id = req.params.id;
  const updated_by = user_id;
  const { name, description, acc_type_id, isDemo, isActive } = req.body;

  // Start a transaction
  const t = await sequelize.transaction();

  try {
      // Find the user info to update
      const userInfo = await UserInfo.findOne({ where: { user_id }, transaction: t });

      if (!userInfo) {
          await t.rollback();
          return res.status(404).json({ resultKey: false, errorMessage: 'User info not found' });
      }

      // Update the user info fields
      userInfo.name = name;
      userInfo.description = description;
      userInfo.acc_type_id = acc_type_id;
      userInfo.isDemo = isDemo;
      userInfo.isActive = isActive;
      userInfo.updated_by = updated_by; // Add the updated_by ID

      // Save the updated user info
      await userInfo.save({ transaction: t });

      // Commit the transaction
      await t.commit();

      res.json({ resultKey: true, message: 'User info updated and saved successfully' });
  } catch (error) {
      // Rollback the transaction if an error occurs
      await t.rollback();

      logger.error(`Error updating and saving user info: ${error.message}`, { stack: error.stack });
      res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to update and save account type
async function updateAndSaveAccountType(req, res) {
  const type_id = req.params.id;
  const updated_by = req.user.id; 
  const { type_name, description, isActive } = req.body;

  // Start a transaction
  const t = await sequelize.transaction();

  try {
      // Find the account type to update
      const accountType = await AccountType.findByPk(type_id, { transaction: t });

      if (!accountType) {
          await t.rollback();
          return res.status(404).json({ resultKey: false, errorMessage: 'Account type not found' });
      }

      // Update the account type fields
      accountType.type_name = type_name;
      accountType.description = description;
      accountType.isActive = isActive;
      accountType.updated_by = updated_by; // Add the updated_by ID

      // Save the updated account type
      await accountType.save({ transaction: t });

      // Commit the transaction
      await t.commit();

      res.json({ resultKey: true, message: 'Account type updated and saved successfully' });
  } catch (error) {
      // Rollback the transaction if an error occurs
      await t.rollback();

      logger.error(`Error updating and saving account type: ${error.message}`, { stack: error.stack });
      res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}


// Controller function to update and save a site
async function updateAndSaveSite(req, res) {
  const siteId = req.params.id;
  const updated_by = req.user.id; // Assuming req.user contains the authenticated user's details
  const { name, url, domain, ip, isActive } = req.body;

  // Start a transaction
  const t = await sequelize.transaction();

  try {
      // Find the site to update
      const site = await Site.findByPk(siteId, { transaction: t });

      if (!site) {
          await t.rollback();
          return res.status(404).json({ resultKey: false, errorMessage: 'Site not found' });
      }

      // Update the site fields
      site.name = name;
      site.url = url;
      site.domain = domain;
      site.ip = ip;
      site.isActive = isActive;
      site.updated_by = updated_by; // Add the updated_by ID

      // Save the updated site
      await site.save({ transaction: t });

      // Commit the transaction
      await t.commit();

      res.json({ resultKey: true, message: 'Site updated and saved successfully' });
  } catch (error) {
      // Rollback the transaction if an error occurs
      await t.rollback();

      logger.error(`Error updating and saving site: ${error.message}`, { stack: error.stack });
      res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}


module.exports = { getAllAcc, getAllAccType, getAllSite, getAccByID, getAccTypeByID, getSiteByID, getAllLogs,  updateAndSaveUserInfo
    , updateAndSaveAccountType, updateAndSaveSite
 };
