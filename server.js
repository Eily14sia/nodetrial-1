const express = require('express');
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize({
  database: 'nodetrial',
  username: 'root',
  password: '', // Update with your database password
  host: 'localhost', // or your database host
  dialect: 'mysql',
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { sequelize, testConnection };
