// Workaround due to log4js external appenders loading mechanism
const log4jsInMemoryAppender = require('./src');

module.exports = log4jsInMemoryAppender;
