const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../server').sequelize;

const commonOptions = {
  timestamps: false, // Disable timestamps
};

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
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
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  created_by: DataTypes.INTEGER,
  updated_by: DataTypes.INTEGER,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE,
  last_login: DataTypes.DATE,
}, { ...commonOptions, tableName: 'users' });

const AccountType = sequelize.define('acc_type', {
  id_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
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
  created_by: DataTypes.INTEGER,
  updated_by: DataTypes.INTEGER,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE,
}, { ...commonOptions, tableName: 'acc_type'});

const UserInfo = sequelize.define('userinfo', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  acc_type_id: {
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
  created_by: DataTypes.INTEGER,
  updated_by: DataTypes.INTEGER,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE,
}, { ...commonOptions, tableName: 'userinfo' });

const Site = sequelize.define('site', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  created_by: DataTypes.INTEGER,
  updated_by: DataTypes.INTEGER,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE,
}, { ...commonOptions, tableName: 'site'  });

const LogMaster = sequelize.define('logmaster', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  tablename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requested_data: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  change_data: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  is_status_change: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  created_by: DataTypes.INTEGER,
  updated_by: DataTypes.INTEGER,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE,
}, { ...commonOptions, tableName: 'logmaster'  });

// Define associations
UserInfo.belongsTo(AccountType, { foreignKey: 'acc_type_id', as: 'accountType' });
User.hasOne(UserInfo, { foreignKey: 'user_id' });
UserInfo.belongsTo(User, { foreignKey: 'user_id' });

// Add a hook to update UserInfo.isActive when User.isActive changes
User.addHook('beforeUpdate', async (user) => {
  if (user.changed('isActive')) {
    const userInfo = await UserInfo.findOne({ where: { user_id: user.id } });
    if (userInfo) {
      userInfo.isActive = user.isActive;
      await userInfo.save();
    }
  }
});

module.exports = { User, UserInfo, AccountType, Site, LogMaster, sequelize };
