const express = require('express');
const jwt = require('jsonwebtoken');
const { sequelize, testConnection } = require('./server');
const { User, UserInfo, AccountType } = require('./models/database'); // Ensure the correct import
const multer = require('multer');
const upload = multer(); // Use multer without disk storage to handle form-data
require('dotenv').config();

const app = express();
app.use(express.json()); // Middleware for parsing JSON requests

// Test the database connection
testConnection();

// Secret key for JWT (replace with a long, secure random string)
const secretKey = process.env.JWT_SECRET_KEY;

// JWT token verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ success: false, message: 'No token provided' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
    req.userId = user.userId;
    req.role = user.role;
    next();
  });
};

// Login route
app.post('/api/login', upload.none(), async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username or password missing' });
    }

    const user = await User.findOne({ where: { username, password } });
    if (user) {
      // Generate JWT token
      const token = jwt.sign({ userId: user.id , role: user.role }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user info route (jwt protected)
app.get('/api/userinfo', verifyToken, async (req, res) => {
    try {
      let userInfo;
  
      if (req.role === 'admin') {
        userInfo = await UserInfo.findByPk(req.userId, {
          attributes: ['user_id', 'name', 'description', 'isDemo', 'isActive'],
          include: [
            {
              model: AccountType,
              as: 'accountType',
              attributes: ['type_name'],
            },
          ],
        });
      } else if (req.role === 'user') {
        userInfo = await UserInfo.findByPk(req.userId, {
          attributes: ['user_id', 'name', 'description', 'isDemo', 'isActive'],
        });
      }
  
      if (userInfo) {
        const userInfoJSON = userInfo.toJSON();
        if (req.role === 'admin') {
          delete userInfoJSON.acc_type;
          delete userInfoJSON.accountType.id_type;
        }
  
        res.json({ success: true, userInfo: userInfoJSON });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
