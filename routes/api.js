var express = require('express');
var MongoClient = require("mongodb");
var router = express.Router();
var url = 'mongodb://localhost:27017/saivasdata';
var assert = require('assert');

var filesaver = require('../bower_components/file-saver/FileSaver');
var stringify = require('json-stable-stringify');
var queryToBeSavedAsText;
router.get('/text', function (rec, res, next) {
    console.log("test");
    var kattepiss = function (db, callback) {
        var cursor = db.collection('diveinterpolated').find({
                startdatetime: {$gte: new Date('2016-09-08T12:00:00Z'), $lt: new Date('2016-09-09T15:00:00Z')}
            },
            {_id: 0, 'timeseries.temp': 1, startdatetime: 1, airtemp: 1});
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

    MongoClient.connect(url, function (err, db) {
        kattepiss(db, function () {
            db.close();
        })
    })
    res.send();
});
module.exports = router;