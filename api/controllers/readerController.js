/* eslint-disable no-console */

'use strict';

var childProcess = require('child_process');
var ps;
var readerController = {
    start: function (res) {
        var readerIp = global.config.connections.reader;
        var properties = [
            '-Dlog4j.configuration=file:logs/log4j.properties',
            '-Dhostname=' + readerIp,
            '-jar',
            'scripts/impinjCtrl.jar'
        ];

        ps = childProcess.spawn('java', properties);
        ps.stdout.on('data', function (data) {
            console.log(data.toString('utf-8'));
        });
        ps.stderr.on('data', function (data) {
            console.log('Error: ', data.toString().trim());
        });
        ps.stdout.on('close', function () {
            console.log('Disconnected.');
        });
        res.json({
            message: 'started'
        });
    },
    end: function (res) {
        if (ps) {
            ps.stdin.setEncoding('utf-8');
            ps.stdin.write('STOP\n');
            ps.stdin.end();
        }
        res.json({
            message: 'stopped'
        });
    }
};

module.exports = readerController;
