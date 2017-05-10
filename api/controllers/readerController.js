/* eslint-disable no-console */

'use strict';

var childProcess = require('child_process');
var dataController = require('./dataController');
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
        dataController.init(function () {
            ps.stdout.on('data', function (data) {
                var raw = data.toString('utf-8');

                if (raw[0] === '{') {
                    dataController.add(JSON.parse(raw));
                }
            });
            ps.stderr.on('data', function (data) {
                dataController.addError({
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
            dataController.end();
        }
        res.json({
            message: 'stopped'
        });
    }
};

module.exports = readerController;
