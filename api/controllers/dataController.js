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

var dataObj;
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
var dataController = {
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
            dataObj = {
                duration: startTime,
                records: [],
                messages: []
            };
            dataController.writeFile(dataObj, callback);
        });
    },
    add: function (entry) {
        dataObj.records.push(entry);
        dataController.writeFile(dataObj);
    },
    end: function () {
        dataObj.duration.end = returnTimeObj();
        dataController.writeFile(dataObj);
    },
    addMessage: function (entry) {
        var err = entry;

        err.timestamp = returnTimeObj();
        dataObj.messages.push(err);
        dataController.writeFile(dataObj);
    },
    writeFile: function (obj, callback) {
        writer.write(stringify(obj), function (err) {
            if (err) {
                console.log('err: ', err);
            }
            if (callback) {
                return callback();
            }
            return true;
        });
    }
};

module.exports = dataController;
