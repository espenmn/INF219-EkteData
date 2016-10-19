var express = require('express');
var MongoClient = require("mongodb");
var router = express.Router();
var url = 'mongodb://localhost:27017/saivasdata';
var assert = require('assert');

var stringify = require('json-stable-stringify');
var queryToBeSavedAsText;

router.get('/allData', function (req, res, next) {

    var parameter = req.query.parameter;
    var dataType = req.query.dataType;
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var depthFrom = parseFloat(req.query.depthFrom);
    var depthTo = parseFloat(req.query.depthTo);
    intDepthFrom = Math.floor(depthFrom);
    intDepthTo = Math.ceil(depthTo)-depthFrom+1;

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
           }, {$sort:{'_id.year':1,'_id.month':1,'_id.day':1,'_id.hour':1,'_id.depth':1}},{$sort:{'_id.year':1,'_id.month':1,'_id.depth':1}});
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
        allValuesBetweenDatesForOneParameter(db, function () {
            db.close();
        })
    });

    res.send(removeElements(queryToBeSavedAsText));
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

    res.send(removeElements(queryToBeSavedAsText));
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
                //console.log(doc);
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


    res.send(removeElements(queryToBeSavedAsText));
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
                //console.log(doc);
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

    res.send(removeElements(queryToBeSavedAsText));
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
                //console.log(doc);
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

    res.send(removeElements(queryToBeSavedAsText));
});

var dateList = [];
var dataList = [];
var depthList = [];

var parameter = "";

var list;

function removeElements(input){

    input = input.replace(/\s/g, "");
    input = input.replace(/{/g, "");
    input = input.replace(/}/g, "");
    input = input.replace(/"/g, "");
    input = input.replace(/undefined/g, "");

    list = input.split(/,|_id:|\[|\]/);

    if(list[0] === "") {
        console.log("s")
    }
        dateList.shift();
    }

    console.log(list);

    return addToList();

}

function addToList() {

    var date = "";
    var expectedDepth;
    var lowDepth;
    var highDepth;

    var hour = "";
    var day = "";
    var week = "";
    var month = "";
    var year = "";

    var firstElement = "";

    for(var d = 0; d<list.length;d++){

        if(list[d].indexOf("depth") !== -1){

            if(isInList(list[d],depthList)) {
                depthList.push(list[d].substring(list[d].indexOf(":") + 1) + "m");
            }
        }

    }

    lowDepth = depthList[0].slice(0,-3);
    highDepth = depthList[depthList.length-1].slice(0,-3);
    expectedDepth = lowDepth;

    for (var i = 0; i < list.length; i++) {

        if(list[i].indexOf("average") !== -1 || list[i].indexOf("value") !== -1) {
                dataList.push(parseFloat(list[i].substring(list[i].indexOf(":") + 1)).toFixed(3));

            date = (year + month + week + day + hour + "").slice(0,-1);

            if(isInList(date,dateList))
                dateList.push(date);

            hour = "";
            day = "";
            week = "";
            month = "";
            year = "";
            date = "";
        }
        else if(list[i].indexOf("depth") !== -1){

            while (list[i].substring(list[i].indexOf(":") + 1).slice(0, -2) != expectedDepth.toString()) {

                dataList.push("-");

                if (expectedDepth.toString() === highDepth)
                    expectedDepth = lowDepth;
                else
                    expectedDepth++;

            }

            if (expectedDepth.toString() === highDepth)
                expectedDepth = lowDepth;
            else
                expectedDepth++;
        else {

            if(firstElement === "")
                firstElement = list[i];

            if(list[i].indexOf("hour") !== -1 )
                hour = list[i].substring(list[i].indexOf(":") + 1) + ".";
            else if(list[i].indexOf("day") !== -1 )
                day = list[i].substring(list[i].indexOf(":") + 1) + ".";
            else if(list[i].indexOf("week") !== -1 )
                week = list[i].substring(list[i].indexOf(":") + 1) + ".";
            else if(list[i].indexOf("month") !== -1 )
                month = list[i].substring(list[i].indexOf(":") + 1) + ".";
            else if(list[i].indexOf("year") !== -1 )
                year = list[i].substring(list[i].indexOf(":") + 1) + ".";
        }
    }


    dateList.shift();

    return buildString();
}

function buildString() {

    var finalString = "";



    for(var i=0;i<dateList.length+1;i++){

        if(i == 0)
            finalString += "Tid\tNr\t";
        else if(i == (dataList.length - 1 ))
            finalString += dateList[i] + "\t" + (i) + "\t";
        else
            finalString += dateList[i-1] + "\t" + (i) + "\t";

        for(var j=(i*depthList.length);j<(depthList.length + i*depthList.length);j++) {

            if(i == 0)
                finalString += depthList[j] + "\t";
            else
                finalString += dataList[j-depthList.length] + "\t";

        }
        finalString += "\n";
    }
    //console.log(finalString);
    return finalString;
}

function isInList(element,list){

    var add = true;

    for(var i=0;i<list.length;i++) {
        if (element.substring(element.indexOf(":") + 1) + "m" === list[i] && element.indexOf("depth") !== -1) {
            add = false;
        } else if((element.substring(list[i].indexOf(":") + 1) + ".").slice(0,-1) === list[i] && element.indexOf("depth") == -1) {
            add = false;
        }

        //if(add)
            //console.log(element + "    " + list[i]);

    }


    return add;

}

module.exports = router;