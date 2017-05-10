/* eslint-disable no-console */

'use strict';

var childProcess = require('child_process');
var dataController = require('./dataController');
var ps;
var readerStarted;
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
        readerStarted = true;
        dataController.init(function () {
            ps.stdin.setEncoding('utf-8');
            ps.stdin.write('STATUS\n');
            ps.stdout.on('data', function (data) {
                var raw = data.toString('utf-8');
                var epcIndex = 5;
                var func;

                if (raw[0] === '{') {
                    if (raw.substring(0, epcIndex) === '{"epc') {
                        func = dataController.add;
                    } else {
                        func = dataController.addMessage;
                    }
                    try {
                        func(JSON.parse(raw));
                    } catch (e) {
                        dataController.addMessage({
                            message: 'JSON parse error',
                            data: raw
                        });
                    }
                }
            });
            ps.stderr.on('data', function (data) {
                dataController.addError({
                    message: data.toString('utf-8')
                });
            });
            // TO DO: session.io?
            res.json({
                message: 'started'
            });
        });
    },
    end: function (res) {
        if (readerStarted) {
            readerStarted = false;
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
