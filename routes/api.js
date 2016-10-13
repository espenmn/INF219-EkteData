var express = require('express');
var MongoClient = require("mongodb");
var router = express.Router();
var url = 'mongodb://localhost:27017/saivasdata';
var assert = require('assert');

var filesaver = require('../bower_components/file-saver/FileSaver');
var stringify = require('json-stable-stringify');
var queryToBeSavedAsText;

router.get('/allData', function (req, res, next) {

    console.log("hello");

    var parameter = req.query.parameter;
    var dataType = req.query.dataType;
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var depthFrom = parseFloat(req.query.depthFrom);
    var depthTo = parseFloat(req.query.depthTo);
    intDepthFrom = Math.floor(depthFrom);
    intDepthTo = Math.ceil(depthTo)-depthFrom+1;

    var allValuesBetweenDatesForOneParameter = function (db, callback) {
        var cursor = db.collection('diveinterpolated').find({
                startdatetime: {$gte: new Date([fromDate]), $lte: new Date([toDate])},
            },
            {_id: 0, [parameter]: 1, startdatetime: 1, timeseries:{$slice:[intDepthFrom,intDepthTo]},"timeseries.pressure(dBAR)":1}).sort({startdatetime:1});
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                console.log(doc);
                queryToBeSavedAsText += stringify(doc, {pretty: true, space: 1})
                removeElements(queryToBeSavedAsText);
            } else {
                callback();
            }
        })
    };


    /**
     var allValuesBetweenDatesForOneParameter = function (db, callback) {
       var cursor = db.collection('diveinterpolated').aggregate({
               $match: {
                   "startdatetime": {
                       $gte: new Date([fromDate]),
                       $lte: new Date([toDate])
                   }
               }
           },
           {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
           {$unwind: "$timeseries"}, {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
           {
               $group: {
                   _id: {year: {$year: "$startdatetime"}, month: {$month: "$startdatetime"},day:{$dayOfMonth:"$startdatetime"},hour:{$hour:"$startdatetime"},depth: "$timeseries.pressure(dBAR)",value:"$"+parameter},
               }
           }, {$sort:{'_id.year':1,'_id.month':1,'_id.depth':1}},{$sort:{'_id.year':1,'_id.month':1,'_id.depth':1}});
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
     **/


    MongoClient.connect(url, function (err, db) {
        allValuesBetweenDatesForOneParameter(db, function () {
            db.close();
        })
    });

    res.send();
});

router.get('/averageMonth', function (req, res, next) {

    var parameter = req.query.parameter;
    var dataType = req.query.dataType;
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var depthFrom = parseFloat(req.query.depthFrom);
    var depthTo = parseFloat(req.query.depthTo);

    var querySearchAverageMonthsBetweenDatesAndDepths = function (db, callback) {
        var cursor = db.collection('diveinterpolated').aggregate({
                $match: {
                    "startdatetime": {
                        $gte: new Date([fromDate]),
                        $lte: new Date([toDate])
                    }
                }
            },
            {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {$unwind: "$timeseries"}, {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {
                $group: {
                    _id: {year: {$year: "$startdatetime"}, month: {$month: "$startdatetime"},depth: "$timeseries.pressure(dBAR)"},
                    average: {$avg: "$" + [parameter]}
                }
            }, {$sort:{'_id.year':1,'_id.month':1,'_id.depth':1}},{$sort:{'_id.year':1,'_id.month':1,'_id.depth':1}});
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
        querySearchAverageMonthsBetweenDatesAndDepths(db, function () {
            db.close();
        })
    });

    res.send();
});

router.get('/averageDay', function (req, res, next) {

    var parameter = req.query.parameter;
    var dataType = req.query.dataType;
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var depthFrom = parseFloat(req.query.depthFrom);
    var depthTo = parseFloat(req.query.depthTo);

    var querySearchAverageDayBetweenDatesAndDepths = function (db, callback) {
        var cursor = db.collection('diveinterpolated').aggregate({
                $match: {
                    "startdatetime": {
                        $gte: new Date([fromDate]),
                        $lte: new Date([toDate])
                    }
                }
            },
            {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {$unwind: "$timeseries"}, {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {
                $group: {
                    _id: {year: {$year: "$startdatetime"}, month: {$month: "$startdatetime"}, day:  {$dayOfMonth:  "$startdatetime"},depth: "$timeseries.pressure(dBAR)"},
                    average: {$avg: "$"+[parameter]}
                }
            }, {$sort:{'_id.year':1,'_id.month':1,'_id.day':1,'_id.depth':1}},{$sort:{'_id.year':1,'_id.month':1,'_id.day':1,'_id.depth':1}});
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
        querySearchAverageDayBetweenDatesAndDepths(db, function () {
            db.close();
        })
    });


    res.send();
});

router.get('/averageWeek', function (req, res, next) {

    var parameter = req.query.parameter;
    var dataType = req.query.dataType;
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var depthFrom = parseFloat(req.query.depthFrom);
    var depthTo = parseFloat(req.query.depthTo);

    var querySearchAverageWeekBetweenDatesAndDepths = function (db, callback) {
        var cursor = db.collection('diveinterpolated').aggregate({
                $match: {
                    "startdatetime": {
                        $gte: new Date([fromDate]),
                        $lte: new Date([toDate])
                    }
                }
            },
            {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {$unwind: "$timeseries"}, {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {
                $group: {
                    _id: {year: {$year: "$startdatetime"}, week: {$week: "$startdatetime"},depth: "$timeseries.pressure(dBAR)"},
                    average: {$avg: "$"+[parameter]}
                }
            }, {$sort:{'_id.year':1,'_id.week':1,'_id.depth':1}},{$sort:{'_id.year':1,'_id.week':1,'_id.depth':1}});
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
        querySearchAverageWeekBetweenDatesAndDepths(db, function () {
            db.close();
        })
    });

    res.send();
});

router.get('/averageYear', function (req, res, next) {

    var parameter = req.query.parameter;
    var dataType = req.query.dataType;
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var depthFrom = parseFloat(req.query.depthFrom);
    var depthTo = parseFloat(req.query.depthTo);

    var querySearchAverageYearBetweenDatesAndDepths = function (db, callback) {
        var cursor = db.collection('diveinterpolated').aggregate({
                $match: {
                    "startdatetime": {
                        $gte: new Date([fromDate]),
                        $lte: new Date([toDate])
                    }
                }
            },
            {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {$unwind: "$timeseries"}, {$match: {"timeseries.pressure(dBAR)": {$gte: depthFrom, $lte: depthTo}}},
            {
                $group: {
                    _id: {year: {$year: "$startdatetime"},depth: "$timeseries.pressure(dBAR)"},
                    average: {$avg: "$"+[parameter]}
                }
            },
            {$sort:{'_id.year':1,'_id.depth':1}},{$sort:{'_id.year':1,'_id.depth':1}});
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
        querySearchAverageYearBetweenDatesAndDepths(db, function () {
            db.close();
        })
    });

    res.send();
});

//////////////////////////
var dateList = [];
var dataList = [];
var depthList = [];

var parameter = "";

var list;

function removeElements(input){

    input = input.replace(/\s/g, "");
    input = input.replace(/{/g, "");
    input = input.replace(/}/g, "");

    list = input.split(/,|_id:|timeseries:\[|\]/);

    /*if(list[0].indexOf("startdatetime") !== -1)
     parameter = list[2].substring(0,list[2].indexOf(":"));*/

    return addToList();

}

function addToList() {

    var date = "";

    for (var i = 0; i < list.length; i++) {

        if(list[i].indexOf("average") !== -1 || list[i].indexOf("value") !== -1) {
            dataList.push(parseFloat(list[i].substring(list[i].indexOf(":") + 1)).toFixed(3));
            dateList.push(date.slice(0,-1));
            date = "";
        }
        else if(list[i].indexOf("depth") !== -1){
            if(!(list[i] in depthList))
                depthList.push(list[i].substring(list[i].indexOf(":") + 1) + "m");
        }
        /*else if(list[i].indexOf("startdatetime") !== -1){
         list[i] = list[i].replace(/-|T/g, ".");
         list[i] = list[i].replace(/startdatetime:/g, "");
         dateList.push(list[i].slice(0,-11))
         }*/ else if(list[i] === ""){

        } /*else if(list[i].indexOf(parameter) !== -1){
         dataList.push(parseFloat(list[i].substring(list[i].indexOf(":") + 1)).toFixed(3));
         }*/
        else {
            date += list[i].substring(list[i].indexOf(":") + 1) + ".";
        }
    }
    return buildString();
}

function buildString() {

    var finalString = "";

    for(var i=0;i<dateList.length;i++){

        if(i == 0)
            finalString += "Tid            Nr   ";
        else
            finalString += dateList[i] + "   " + (i) + "    ";

        for(var j=0;j<depthList.length;j++) {

            if(i == 0)
                finalString += depthList[j] + "      ";
            else
                finalString += dataList[j] + "      ";

        }
        finalString += "\n";
    }
    console.log(finalString);
    return finalString;
}

/////////////////



module.exports = router;