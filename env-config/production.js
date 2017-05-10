/* eslint-disable no-process-env */

'use strict';

/*
    Accepts environment variables when starting server:
    READER_ADDRESS: Impinj Reader's address
    LOG_PATH: Log file path
*/
var configs = {
    connections: {
        reader: '192.168.0.100'
    },
    fileLoggerPath: '/media/pi/STICKY/logs/',
    port: 80
};

module.exports = configs;
