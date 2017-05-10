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
            '-Dlog4j.configuration=file:env-config/log4j.properties',
            '-Dhostname=' + readerIp,
            '-jar',
            'node_modules/impinjCtrl/out/impinjCtrl.jar'
        ];

        if (!readerStarted) {
            readerStarted = true;
            ps = childProcess.spawn('java', properties);
            return dataController.init(function () {
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
                    dataController.addMessage({
                        message: data.toString('utf-8')
                    });
                });
                // TO DO: session.io?
                return res.json({
                    message: 'Started'
                });
            });
        }
        // TO DO: session.io?
        return res.json({
            message: 'Already started'
        });
    },
    end: function (res) {
        if (readerStarted) {
            readerStarted = false;
            ps.stdin.setEncoding('utf-8');
            ps.stdin.write('STOP\n');
            ps.stdin.end();
            dataController.end();
            return res.json({
                message: 'stopped'
            });
        }
        return res.json({
            message: 'No active reader'
        });
    }
};

module.exports = readerController;
