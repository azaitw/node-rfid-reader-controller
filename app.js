/* eslint-disable new-cap, no-console */
'use strict';

var express = require('express');
var app = express();
var port;
var router = express.Router();
var readerController = require('./api/controllers/readerController');

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
console.log('Reader on port ' + port);
