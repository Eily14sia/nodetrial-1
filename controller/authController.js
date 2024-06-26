const { sequelize, User, UserInfo, AccountType } = require('../models/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const logger = require('../utils/logger');

require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;

// Configure multer
const upload = multer();

function generateToken(user) {
  const payload = { id: user.id, username: user.username, role_id: user.role_id };
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, secretKey, options);
}

// Define the login function
async function login(req, res) {
  const { username, password } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ resultKey: false, errorMessage: 'Username is required' });
    }

    if (!password) {
      return res.status(400).json({ resultKey: false, errorMessage: 'Password is required' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ resultKey: false, errorMessage: 'Invalid username or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ resultKey: false, errorMessage: 'Account is inactive' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ resultKey: false, errorMessage: 'Invalid username or password' });
    }

    const token = generateToken(user);

    // Start a transaction
    const transaction = await sequelize.transaction();
    try {
      // Update the last_login and updated_by columns within the transaction
      user.last_login = new Date();
      user.updated_by = user.id;
      await user.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      return res.json({ resultKey: true, resultValue: token });
    } catch (updateError) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      logger.error(`Error updating last_login: ${updateError.message}`);
      console.error('Error updating last_login:', updateError);
      return res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
    }
  } catch (error) {
    logger.error(`Error logging in: ${error.message}`);
    console.error('Error logging in:', error);
    return res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

async function getUserInfoByID(req, res) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).json({ resultKey: false, errorMessage: 'Token not provided' });
    }

    jwt.verify(token.split(' ')[1], secretKey, async (err, decodedToken) => {
      if (err) {
        logger.error(`Error verifying token: ${err.message}`);
        console.error('Error verifying token:', err);
        return res.status(403).json({ resultKey: false, errorMessage: 'Failed to authenticate token' });
      }

      const user = await User.findByPk(decodedToken.id);
      if (!user) {
        return res.status(404).json({ resultKey: false, errorMessage: 'User not found' });
      }

      if (!user.isActive) {
        return res.status(403).json({ resultKey: false, errorMessage: 'Account is inactive' });
      }

      if (user.role_id !== 1) {
        return res.status(403).json({ resultKey: false, errorMessage: 'Access denied' });
      }

      const userInfo = await UserInfo.findOne({
        where: { user_id: user.id },
        attributes: ['user_id', 'name', 'description', 'isDemo', 'isActive'],
        include: [
          {
            model: AccountType,
            as: 'accountType',
            attributes: ['type_name'],
          },
        ],
      });

      if (!userInfo) {
        return res.status(404).json({ resultKey: false, errorMessage: 'User info not found' });
      }

      const userInfoJSON = userInfo.toJSON();
      delete userInfoJSON.acctype;
      delete userInfoJSON.accountType.id_type;

      res.json({ resultKey: true, resultValue: userInfoJSON });
    });
  } catch (error) {
    logger.error(`Error fetching user info: ${error.message}`);
    console.error('Error fetching user info:', error);
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

module.exports = { login, getUserInfoByID };