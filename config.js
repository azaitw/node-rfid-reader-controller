/* eslint-disable no-process-env */

'use strict';

var configFile;

// This is the only place we reference process.env.NODE_ENV
if (process.env.NODE_ENV === 'production') {
    configFile = require('./env-config/production');
} else {
    configFile = require('./env-config/development');
}
if (typeof process.env.READER_ADDRESS !== 'undefined') {
    configFile.connections.reader = process.env.READER_ADDRESS;
}
if (typeof process.env.LOG_PATH !== 'undefined') {
    configFile.fileLoggerPath = process.env.LOG_PATH;
}
module.exports = configFile;
