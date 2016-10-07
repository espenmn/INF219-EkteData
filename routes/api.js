var express = require('express');
var MongoClient = require("mongodb");
var router = express.Router();
var url = 'mongodb://localhost:27017/saivasdata';
var assert = require('assert');

var filesaver = require('../bower_components/file-saver/FileSaver');
var stringify = require('json-stable-stringify');
var queryToBeSavedAsText;
router.get('/text', function (req, res, next) {

    var parameter = req.query.parameter;
    var dataType = req.query.dataType;
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var depthFrom = req.query.depthFrom;
    var depthTo = req.query.depthTo;

    var allValuesBetweenDatesForOneParameter = function (db, callback) {
        var cursor = db.collection('diveinterpolated').find({
                startdatetime: {$gte: new Date([fromDate]), $lt: new Date([toDate])}
            },
            {_id: 0, [parameter]: 1, startdatetime: 1});
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                console.log(doc);
                queryToBeSavedAsText += stringify(doc, {pretty: true, space: 1})
            } else {
                callback();
            }
        })
    };


    var querySearchAverageMonthsBetweenDates = function (db, callback) {
        var cursor = db.collection('diveinterpolated').aggregate({$unwind: "$timeseries"},
            {$match: {'startdatetime': {$gte: new Date([fromDate]), $lt: new Date([toDate])}}},
            {
                $group: {
                    _id: {year: {$year: "$startdatetime"}, month: {$month: "$startdatetime"}},
                    avgTemp: {$avg: "$timeseries.temp"}
                }
            },
            {$sort: {_id: 1}});
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                console.log(doc);
                queryToBeSavedAsText += stringify(doc, {pretty: true, space: 1})
            } else {
                callback();
            }
        })
    };

    var querySearchAverageMonthsBetweenDatesAndDepths = function (db, callback) {
        var cursor = db.collection('diveinterpolated').aggregate({
                $match: {
                    "startdatetime": {
                        $gt: new Date([fromDate]),
                        $lt: new Date([toDate])
                    }
                }
            },
            {$match: {"timeseries.pressure(dBAR)": {$gte: [depthFrom], $lte: [depthTo]}}},
            {$unwind: "$timeseries"}, {$match: {"timeseries.pressure(dBAR)": {$gte: [depthFrom], $lte: [depthTo]}}},
            {
                $group: {
                    _id: {year: {$year: "$startdatetime"}, month: {$month: "$startdatetime"}},
                    avgTemp: {$avg: "$timeseries.temp"}
                }
            }, {$sort: {_id: 1}});
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                console.log(doc);
                queryToBeSavedAsText += stringify(doc, {pretty: true, space: 1})
            } else {
                callback();
            }
        })
    };

    if(dataType==="allData") {
        MongoClient.connect(url, function (err, db) {
            allValuesBetweenDatesForOneParameter(db, function () {
                db.close();
            })
        });
    }
    else if(dataType==="monthlyAverage") {
        MongoClient.connect(url, function (err, db) {
            querySearchAverageMonthsBetweenDatesAndDepths(db, function () {
                db.close();
            })
        });
    }

    res.send();
});
module.exports = router;