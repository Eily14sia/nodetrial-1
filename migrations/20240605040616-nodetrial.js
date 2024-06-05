'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.sequelize.query('CREATE DATABASE IF NOT EXISTS nodetrial');

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_by: Sequelize.INTEGER,
      updated_by: Sequelize.INTEGER,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
      last_login: Sequelize.DATE,
    });

    await queryInterface.createTable('acc_type', {
      id_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      type_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      created_by: Sequelize.INTEGER,
      updated_by: Sequelize.INTEGER,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    });

    await queryInterface.createTable('userinfo', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      acc_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'acc_type',
          key: 'id_type',
        },
      },
      isDemo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      created_by: Sequelize.INTEGER,
      updated_by: Sequelize.INTEGER,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('userinfo');
    await queryInterface.dropTable('acc_type');
    await queryInterface.dropTable('users');
  },
};
