/* eslint-disable no-console, no-param-reassign, no-sync */

'use strict';

var fileContentObj;
var fileController;
var fileLoggerPath;
var fs = require('fs');
var fstorm = require('fstorm');
var returnTimeObj = function () {
    var apendZero = function (input) {
        var sliceIndex = -2;

        return ('0' + input).slice(sliceIndex);
    };
    var date = new Date();

    return {
        date: date.getFullYear() + '-' + apendZero(date.getMonth()) + '-' + apendZero(date.getDate()),
        time: apendZero(date.getHours()) + ':' + apendZero(date.getMinutes()) + ':' + apendZero(date.getSeconds())
    };
};
var stringify = require('fast-stable-stringify');
var writer;

/*  Writes a log file with the following format:
    {
        duration: {
            start: {
                date:
                time:
            },
            end: {
                date:
                time:
            }
        },
        records: [],
        errors: []
    }
*/
fileController = {
    init: function (callback) {
        var timeObj = returnTimeObj();
        var returnFilepath = function (callback) {
            var index = 1;
            var filenameBase = timeObj.date + '_session-';
            var checker = function (index) {
                var filePath = global.config.fileLoggerPath + filenameBase + index + '.json';

                if (fs.existsSync(filePath)) {
                    index += 1;
                    return checker(index);
                }
                return callback(filePath);
            };

            checker(index);
        };

        returnFilepath(function (filepath) {
            var startTime = {
                start: timeObj
            };

            fileLoggerPath = filepath;
            writer = fstorm(fileLoggerPath);
            fileContentObj = {
                duration: startTime,
                records: [],
                errors: []
            };
            writer.write(stringify(fileContentObj), function (err) {
                if (err) {
                    console.log('err: ', err);
                }
                callback();
            });
        });
    },
    add: function (entry) {
        fileContentObj.records.push(entry);
        writer.write(stringify(fileContentObj), function (err) {
            if (err) {
                console.log('err: ', err);
            }
        });
    },
    end: function () {
        fileContentObj.duration.end = returnTimeObj();
        writer.write(stringify(fileContentObj), function (err) {
            if (err) {
                console.log('err: ', err);
            }
        });
    },
    addError: function (entry) {
        entry.timestamp = returnTimeObj;
        fileContentObj.errors.push(entry);
        writer.write(stringify(fileContentObj), function (err) {
            if (err) {
                console.log('err: ', err);
            }
        });
    }
};

module.exports = fileController;
