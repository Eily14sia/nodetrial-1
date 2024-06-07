const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;
const path = require('path');
const fs = require('fs');
const DailyRotateFile = require('winston-daily-rotate-file');

// Ensure logs directory exists
const logDirectory = path.join(__dirname, '../public/logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Define custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  const stackInfo = stack ? getStackInfo(stack) : '';
  return `${timestamp} ${level}: ${message} ${stackInfo}`;
});

// Function to extract file location and line number from stack trace
function getStackInfo(stack) {
  const stackLines = stack.split('\n');
  const relevantLine = stackLines[1]; 
  const match = relevantLine.match(/\((.*):(\d+):(\d+)\)/);
  if (match) {
    const [, filePath, line, column] = match;
    const relativeFilePath = path.relative(process.cwd(), filePath);
    return `at ${relativeFilePath}:${line}:${column}`;
  }
  return '';
}

// Create logger instance
const logger = createLogger({
  level: 'error',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // Capture stack trace
    logFormat
  ),
  transports: [
    new DailyRotateFile({
      dirname: logDirectory,
      filename: 'log_%DATE%.txt',
      datePattern: 'MM-DD-YYYY',
      handleExceptions: true,
      json: false,
      maxSize: '5m', // 5MB
      maxFiles: '14d' // Keep files for 14 days
    })
  ],
  exitOnError: false,
});

module.exports = logger;
