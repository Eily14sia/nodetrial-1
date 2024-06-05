const express = require('express');
const app = express();
const cors = require('cors'); // Assuming you want to allow CORS (consider security implications)
const dotenv = require('dotenv').config();
const router = express.Router();

// Connect to the database
const { testConnection } = require('./server'); // Assuming server.js is in the same directory

// Routes
const authRoutes = require('./route/authRoutes');
const userRoutes = require('./route/userRoutes');

// Test the database connection (optional)
testConnection(); // Call this function to test the connection on startup

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS if needed
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); // Assuming all routes are prefixed with '/api'

// Start the server
const PORT = process.env.PORT; // Use PORT from .env file or default to 3000
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
