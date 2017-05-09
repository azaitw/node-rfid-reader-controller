/* eslint-disable no-process-env */

'use strict';

var configFile;

if (process.env.NODE_ENV === 'production') {
    configFile = require('./env-config/production');
} else {
    configFile = require('./env-config/development');
}
module.exports = configFile;
