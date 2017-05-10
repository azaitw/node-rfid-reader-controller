/* eslint-disable no-console */

'use strict';

var childProcess = require('child_process');
var fileController = require('./fileController');
var ps;
var readerController = {
    start: function (res) {
        var readerIp = global.config.connections.reader;
        var properties = [
            '-Dlog4j.configuration=file:logs/log4j.properties',
            '-Dhostname=' + readerIp,
            '-jar',
            'node_modules/impinjCtrl/out/impinjCtrl.jar'
        ];

        ps = childProcess.spawn('java', properties);
        fileController.init(function () {
            ps.stdout.on('data', function (data) {
                var raw = data.toString('utf-8');

                if (raw[0] === '{') {
                    fileController.add(JSON.parse(raw));
                }
            });
            ps.stderr.on('data', function (data) {
                fileController.addError({
                    message: data.toString('utf-8').trim()
                });
            });
            // TO DO: session.io
            res.json({
                message: 'started'
            });
        });
    },
    end: function (res) {
        if (ps) {
            ps.stdin.setEncoding('utf-8');
            ps.stdin.write('STOP\n');
            ps.stdin.end();
            fileController.end();
        }
        res.json({
            message: 'stopped'
        });
    }
};

module.exports = readerController;
