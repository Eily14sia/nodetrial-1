const { User, UserInfo, AccountType } = require('../models/database');
const bcrypt = require('bcrypt');
const saltRounds = 10; // You can adjust the salt rounds for hashing

// Controller function to create a new user and user info
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

    // Create the user with isActive set to true and the related acc_type_id
    const newUser = await User.create({ username, password: hashedPassword, role_id, isActive: true });

    // Create the user info with isActive based on the user's isActive status and the fetched acc_type_id
    const newUserInfo = await UserInfo.create({
      user_id: newUser.id,
      name,
      description,
      acc_type_id: accountType.id_type,
      isDemo: isDemo || false,
      isActive: newUser.isActive,
    });

    // Fetch the acc_type name corresponding to the acc_type_id
    const accTypeName = accountType.type_name;

    res.json({ resultKey: true, user: newUser, userInfo: { ...newUserInfo.toJSON(), acc_type: accTypeName } });
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

    res.json({ resultKey: true, resultValue: 'User and associated user info deactivated successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ resultKey: false, errorMessage: 'Server error' });
  }
}

module.exports = { createUser, deleteUser };
