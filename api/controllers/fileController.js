/* eslint-disable no-console, no-param-reassign, no-sync */

'use strict';

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

var fileContentObj;
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
var fileController = {
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

            writer = fstorm(filepath);
            fileContentObj = {
                duration: startTime,
                records: [],
                errors: []
            };
            fileController.writeFile(fileContentObj, callback);
        });
    },
    add: function (entry) {
        fileContentObj.records.push(entry);
        fileController.writeFile(fileContentObj);
    },
    end: function () {
        fileContentObj.duration.end = returnTimeObj();
        fileController.writeFile(fileContentObj);
    },
    addError: function (entry) {
        var err = entry;

        err.timestamp = returnTimeObj;
        fileContentObj.errors.push(err);
        fileController.writeFile(fileContentObj);
    },
    writeFile: function (obj, callback) {
        writer.write(stringify(obj), function (err) {
            if (err) {
                console.log('err: ', err);
            }
            if (callback) {
                callback();
            }
        });
    }
};

module.exports = fileController;
