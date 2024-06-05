// logger.js

const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf } = format;
const fs = require('fs');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');

// Create the log directory if it doesn't exist
const logDirectory = path.join(__dirname, 'public', 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Define the log format
const logFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

// Create a logger instance with DailyRotateFile transport
const logger = createLogger({
  level: 'error', // Set the log level to error
  format: logFormat,
  transports: [
    new DailyRotateFile({
      filename: path.join(logDirectory, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '7d' // Retain log files for 7 days
    })
  ]
});

// Function to log errors
function logError(error) {
  logger.error(error.message);
}

module.exports = { logError };
