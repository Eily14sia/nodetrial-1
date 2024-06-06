const express = require('express');
const app = express();
const cors = require('cors'); 
const dotenv = require('dotenv').config();
const router = express.Router();

// Connect to the database
const { testConnection } = require('./server'); 

// Routes
const authRoutes = require('./route/authRoutes');
const userRoutes = require('./route/userRoutes');
const superAdminRoutes = require('./route/superAdminRoutes');

testConnection(); // Call this function to test the connection on startup

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS if needed
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); 
app.use('/api/superAdmin', superAdminRoutes); 

// Start the server
const PORT = process.env.PORT; // Use PORT from .env file or default to 3000
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
