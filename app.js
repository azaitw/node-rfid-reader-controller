/* eslint-disable new-cap, no-console */
'use strict';

var express = require('express');
var app = express();
var port;
var router = express.Router();
var readerController = require('./api/controllers/readerController');
var os = require('os');
var ifaces = os.networkInterfaces();

global.config = require('./config');
port = global.config.port;
router.get('/start', function (req, res) {
    readerController.start(res);
});
router.get('/end', function (req, res) {
    readerController.end(res);
});
// Register all our routes with /api
app.use('/api', router);

app.listen(port);
console.log('RFID reader controller started');
console.log('===================================================');

Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
        if (iface.family !== 'IPv4' || iface.internal !== false) {
            return;
        }
        console.log('- Start reader: http://' + iface.address + ':' + port + '/api/start');
        console.log('- End reader:   http://' + iface.address + ':' + port + '/api/end');
        console.log('- Log file:    ', global.config.fileLoggerPath);
        console.log('===================================================');
    });
});
