const { sequelize, User, UserInfo, AccountType, Site } = require('../models/database');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');
const saltRounds = 10; // You can adjust the salt rounds for hashing

async function createUser(req, res) {
  const { username, password, role_id, name, description, acc_type, isDemo } = req.body;

  try {
    if (!username || !password || !role_id || !name || !acc_type) {
      return res.status(400).json({ resultKey: false, errorMessage: 'Missing required fields' });
    }

    if (role_id !== '1') {
      return res.status(400).json({ resultKey: false, errorMessage: 'Invalid role' });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ resultKey: false, errorMessage: 'Username already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Find the AccountType based on acc_type
    const accountType = await AccountType.findOne({ where: { id_type: acc_type } });
    if (!accountType) {
      return res.status(404).json({ resultKey: false, errorMessage: 'Account type not found' });
    }

    // Get the ID of the user who is creating the new user
    const createdBy = req.user.id;

    // Start a transaction
    const transaction = await sequelize.transaction();
    try {
      // Create the user with isActive set to true and the related acc_type_id
      const newUser = await User.create({
        username,
        password: hashedPassword,
        role_id,
        isActive: true,
        created_by: createdBy,
        updated_by: createdBy,
      }, { transaction });

      // Create the user info with isActive based on the user's isActive status and the fetched acc_type_id
      const newUserInfo = await UserInfo.create({
        user_id: newUser.id,
        name,
        description,
        acc_type_id: accountType.id_type,
        isDemo: isDemo || false,
        isActive: newUser.isActive,
        created_by: createdBy,
        updated_by: createdBy,
      }, { transaction });

      // Commit the transaction
      await transaction.commit();

      // Fetch the acc_type name corresponding to the acc_type_id
      const accTypeName = accountType.type_name;

      res.json({ resultKey: true, user: newUser, userInfo: { ...newUserInfo.toJSON(), acc_type: accTypeName } });
    } catch (createError) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      logger.error(`Error creating new user: ${createError.message}`, { stack: createError.stack });
      return res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
    }
  } catch (error) {
    logger.error(`Error creating new user: ${error.message}`, { stack: error.stack });
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}


// Controller function to delete a user and its user info
async function deleteUser(req, res) {
  const userId = req.params.id;
  const updatedBy = userId; // Assuming req.user contains the authenticated user's details
  const deletedAt = new Date();

  const transaction = await sequelize.transaction();
  try {
    // Find the user and associated user info
    const user = await User.findByPk(userId, { transaction });
    const userInfo = await UserInfo.findOne({ where: { user_id: userId }, transaction });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ resultKey: false, errorMessage: 'User not found' });
    }

    // Update user info isActive field if it exists
    if (userInfo) {
      await userInfo.update({ 
        isActive: false,
        updated_by: updatedBy,
        deleted_at: deletedAt
      }, { transaction });
    }

    // Update the user isActive field
    await user.update({
      isActive: false,
      updated_by: updatedBy,
      deleted_at: deletedAt
    }, { transaction });

    await transaction.commit();
    res.json({ resultKey: true, resultValue: 'User and associated user info deactivated successfully' });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error deleting user: ${error.message}`, { stack: error.stack });
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

// Controller function to create a site
async function createSite(req, res) {
  const { name, url, domain, ip, isActive } = req.body;

  // Check if required fields are missing
  if (!name || !url || !domain || !ip || isActive === undefined) {
    return res.status(400).json({ resultKey: false, errorMessage: 'Required fields are missing' });
  }

  // Get the ID of the user who is creating the site
  const createdBy = req.user.id; // Assuming req.user contains the authenticated user's details

  // Start a transaction
  const transaction = await sequelize.transaction();
  try {
    // Create the site
    const newSite = await Site.create({
      name,
      url,
      domain,
      ip,
      isActive,
      created_by: createdBy,
      updated_by: createdBy,
    }, { transaction });

    // Commit the transaction
    await transaction.commit();

    res.json({ resultKey: true, message: 'Site created successfully', site: newSite });
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    logger.error(`Error creating site: ${error.message}`, { stack: error.stack });
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to deactivate a site
async function deleteSite(req, res) {
  const siteId = req.params.id;

  const transaction = await sequelize.transaction();
  try {
    // Find the site
    const site = await Site.findByPk(siteId, { transaction });

    if (!site) {
      await transaction.rollback();
      return res.status(404).json({ resultKey: false, errorMessage: 'Site not found' });
    }

    // Deactivate the site
    await site.update({
      isActive: false,
      updated_by: req.user.id, // Assuming req.user contains the authenticated user's details
      deleted_at: new Date(),
    }, { transaction });

    await transaction.commit();
    res.json({ resultKey: true, message: 'Site deactivated successfully' });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error deactivating site: ${error.message}`, { stack: error.stack });
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to create an account type
async function createAccType(req, res) {
  const { type_name, description, isActive } = req.body;

  // Check if required fields are missing
  if (!type_name || !description || isActive === undefined) {
    return res.status(400).json({ resultKey: false, errorMessage: 'Required fields are missing' });
  }

  // Get the ID of the user who is creating the account type
  const createdBy = req.user.id; // Assuming req.user contains the authenticated user's details

  // Start a transaction
  const transaction = await sequelize.transaction();
  try {
    // Create the account type
    const newAccType = await AccountType.create({
      type_name,
      description,
      isActive,
      created_by: createdBy,
      updated_by: createdBy,
    }, { transaction });

    // Commit the transaction
    await transaction.commit();

    res.json({ resultKey: true, message: 'Account type created successfully', accountType: newAccType });
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    logger.error(`Error creating account type: ${error.message}`, { stack: error.stack });
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to deactivate an account type
async function deleteAccType(req, res) {
  const typeId = req.params.id;

  const transaction = await sequelize.transaction();
  try {
    // Find the account type
    const accType = await AccountType.findByPk(typeId, { transaction });

    if (!accType) {
      await transaction.rollback();
      return res.status(404).json({ resultKey: false, errorMessage: 'Account type not found' });
    }

    // Deactivate the account type
    await accType.update({
      isActive: false,
      updated_by: req.user.id, // Assuming req.user contains the authenticated user's details
      deleted_at: new Date(),
    }, { transaction });

    await transaction.commit();
    res.json({ resultKey: true, message: 'Account type deactivated successfully' });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error deactivating account type: ${error.message}`, { stack: error.stack });
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

module.exports = { createUser, deleteUser,  updateAndSaveUserInfo
  , updateAndSaveAccountType, updateAndSaveSite, createSite, deleteSite, createAccType, deleteAccType };
