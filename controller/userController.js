const { User, UserInfo } = require('../models/database');
const bcrypt = require('bcrypt');
const multer = require('multer');
const authenticateToken = require('../middleware/authToken');
const saltRounds = 10; // You can adjust the salt rounds for hashing

// Configure multer
const upload = multer();

// Controller function to create a new user and user info
async function createUser(req, res) {
  const { username, password, role_id, name, description, acc_type, isDemo, isActive } = req.body;

  try {
    if (!username || !password || !role_id || !name || !acc_type) {
      return res.status(400).json({ resultKey: false, errorMessage: 'Missing required fields' });
    }

    if (role_id !== '1') {
      return res.status(400).json({ resultKey: false, errorMessage: 'Invalid role' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({ username, password: hashedPassword, role_id });
    const newUserInfo = await UserInfo.create({
      user_id: newUser.id,
      name,
      description,
      acc_type,
      isDemo: isDemo || false,
      isActive: isActive || true,
    });

    res.json({ resultKey: true, user: newUser, userInfo: newUserInfo });
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Controller function to delete a user and its user info
async function deleteUser(req, res) {
  const userId = req.params.id;

  try {
    // Find the user and associated user info
    const user = await User.findByPk(userId);
    const userInfo = await UserInfo.findOne({ where: { user_id: userId } });

    if (!user) {
      return res.status(404).json({ resultKey: false, errorMessage: 'User not found' });
    }

    // Update user info isActive field if it exists
    if (userInfo) {
      await userInfo.update({ isActive: false });
    }

    // Update the user isActive field
    await user.update({ isActive: false });

    res.json({ resultKey: true, errorMessage: 'User and associated user info deactivated successfully' });
  } catch (error) {
    logError(error); // Log the error
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

// Use multer to handle form data for createUser
const createUserWithMulter = [upload.none(), authenticateToken, createUser];
const deleteUserWithAuth = [authenticateToken, deleteUser];

module.exports = { createUser: createUserWithMulter, deleteUser: deleteUserWithAuth };
