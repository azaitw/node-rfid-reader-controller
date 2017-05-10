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
    fileLoggerPath: '/Users/azai/webserver/race/readerLogs/',
    port: 80
};

if (typeof process.env.READER_ADDRESS !== 'undefined') {
    configs.connections.reader = process.env.READER_ADDRESS;
}
if (typeof process.env.LOG_PATH !== 'undefined') {
    configs.fileLoggerPath = process.env.LOG_PATH;
}
module.exports = configs;
