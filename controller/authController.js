const { User, UserInfo, AccountType } = require('../models/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
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
    res.json({ resultKey: true, resultValue: token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}
async function getUserInfo(req, res) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).json({ resultKey: false, errorMessage: 'Token not provided' });
    }

    jwt.verify(token.split(' ')[1], secretKey, async (err, decodedToken) => {
      if (err) {
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
    console.error('Error fetching user info:', error);
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Use multer to handle form data for login
const loginWithMulter = [upload.none(), login];

module.exports = { login: loginWithMulter, getUserInfo };
