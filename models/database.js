const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../server').sequelize;

// Define the AccountType model first
const AccountType = sequelize.define('acc_type', {
  id_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  type_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  timestamps: false, // Disable timestamps
  tableName: 'acc_type', // Specify the table name if it's different from the model name
});

// Define the User model
const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false, // Disable timestamps
  tableName: 'users', // Specify the table name if it's different from the model name
});

// Define the UserInfo model
const UserInfo = sequelize.define('userinfo', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  acc_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isDemo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  timestamps: false, // Disable timestamps
  tableName: 'userinfo', // Specify the table name if it's different from the model name
});

// Define the association
UserInfo.belongsTo(AccountType, { foreignKey: 'acc_type', as: 'accountType' });

module.exports = { User, UserInfo, AccountType };
