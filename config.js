/* eslint-disable no-process-env */

'use strict';

var configFile;

// This is the only place we reference process.env.NODE_ENV
if (process.env.NODE_ENV === 'production') {
    configFile = require('./env-config/production');
} else {
    configFile = require('./env-config/development');
}
module.exports = configFile;
