/*var string1 = "{startdatetime : ISODate(2016-09-10T00:00:29Z),timeseries : [{temp : 14.9649583333,pressure(dBAR) : 0.5},{temp : 14.5891383929,pressure(dBAR) : 1.5},{temp : 14.1627991071,pressure(dBAR) : 2.5},{temp : 13.9118380282,pressure(dBAR) : 3.5},{temp : 13.7604295775, pressure(dBAR) : 4.5},{temp : 13.6090211268, pressure(dBAR) : 5.5},{temp : 13.4567009804, pressure(dBAR) : 6.5},{temp : 13.4179754902, pressure(dBAR) : 7.5},{temp : 13.0219813084, pressure(dBAR) : 8.5},{temp : 12.4037735849, pressure(dBAR) : 9.5},{temp : 11.6175294118, pressure(dBAR) : 10.5},{temp : 10.3057647059, pressure(dBAR) : 11.5},{temp : 9.3543544304, pressure(dBAR) : 12.5},{temp : 9.0193755274, pressure(dBAR) : 13.5},{temp : 8.6164219409, pressure(dBAR) : 14.5}]}";

var result = "";

var list;
var finishedString;

var stringLength = 20;

var parameter = "Temperature";

var depthList = [];
var parameterList = [];
var timestamp = [];

strip();

function strip() {

    window.alert(result);

    string1 = result;

    string1 = string1.replace(/\s/g, "");
    string1 = string1.replace(/{/g, "");
    string1 = string1.replace(/}/g, "");

    split();

}

function split() {

    list = string1.split(/,|\[|\]/);
    addToLists()
}

function addToLists(){

    var counter = 0;
    var timestapCounter=0;

    ////////////////////Save depth///////////////////

    if(list[2].indexOf("temp") !== -1){
        parameter = "Temperature: "
    } else if(list[2].indexOf("turbidity") !==-1){
        parameter = "Turbidity: ";
    } else if(list[2].indexOf("fluorescens") !== -1){
        parameter = "Fluorescent: "
    } else if(list[2].indexOf("salt") !== -1){
        parameter = "Salt: ";
    } else if(list[2].indexOf("oxygene") !== -1){
        parameter = "Oxygen: "
    }

    for(var i=3;i<list.length;i+=2){

        if(list[i] != 'timeseries:') {
            depthList[counter] = list[i].replace(/pressure\(dBAR\):/g, parameter) + "m";
            depthList[counter] += new Array(stringLength - depthList[counter].length).join(" ");
            counter++;
        }
        else{
            break;
        }
    }

    counter=0;

    ////////////Save parameter data and timestamp/////////////////

    for(var i=0;i<list.length;i+=2){
        if(list[i].indexOf('startdatetime') == -1){
            parameterList[counter] = parseFloat(list[i].substring(list[i].indexOf(":") + 1)).toFixed(3);
            parameterList[counter] += new Array(stringLength - parameterList[counter].length).join(" ");
            counter++;
        } else{
            timestamp[timestapCounter] = fixDate(list[i]);
            timestapCounter++;
        }
    }

    format()
}

function fixDate(date){

    var newDate;

    date = date.substring(21);
    date = date.replace(/Z\)/g, "");
    date = date.replace(/\(/g, "");

    var list = date.split(/-|T|:/);

    TODO: Make it actually work

    newDate = "'" + list[0] + "." + list[1] + "." + list[2] + "." + list[3] + "'";

    if(true)
     newDate = "'" + list[0] + "." + list[1] + "." + list[2] + "." + list[3] + "'";
     else if(false)
     newDate = "'" + list[0] + "." + list[1] + "." + list[2] + "'";
     else
     newDate = "'" + list[0] + "'";

    return newDate;
}

function format() {

    finishedString = "Time                Nr     ";

    for (var i = 0; i < timestamp.length + 1; i++) {
        if (i > 0) {
            finishedString += timestamp[i - 1] + "     " + i + "      ";
        }
        if (i > 0) {
            for (var j = depthList.length * (i - 1); j < depthList.length * (i); j++) {
                finishedString += parameterList[j];
            }
        } else {
            for (var j = 0; j < depthList.length; j++) {
                finishedString += depthList[j];
            }
        }
        finishedString += "\n";
    }
    window.alert(finishedString);
}

function testcase(string){
    result = string;
}*/

var input;

var allDataValues = "{ startdatetime: 2016-09-15T20:00:28.000Z, timeseries:[ { temp: 17.8787291667 }, { temp: 16.8668440367 }, { temp: 15.4650091743 }, { temp: 14.6223030303 }, { temp: 14.3738181818 }, { temp: 14.1253333333 }, { temp: 13.8866373057 }, { temp: 13.8539948187 }, { temp: 13.4504 }, { temp: 12.7268166667 }, { temp: 11.8898148148 }, { temp: 10.6083333333 }, { temp: 9.5824657534 }, { temp: 9.1783561644 }, { temp: 8.7742465753 }, { temp: 8.2516126126 }, { temp: 8.1074684685 }, { temp: 7.9633243243 } ] }{ startdatetime: 2016-09-15T18:00:34.000Z, timeseries:[ { temp: 16.7343783784 }, { temp: 16.0443333333 }, { temp: 15.3462112676 }, { temp: 14.7318059701 }, { temp: 14.4090447761 }, { temp: 14.0862835821 }, { temp: 13.8604 }, { temp: 13.8044 }, { temp: 13.0767169811 }, { temp: 12.1122653061 }, { temp: 11.1411333333 }, { temp: 10.0235142857 }, { temp: 9.2813367698 }, { temp: 8.9706838488 }, { temp: 8.6600309278 }, { temp: 8.2112345133 }, { temp: 8.1240663717 } ] }{ startdatetime: 2016-09-15T16:00:43.000Z, timeseries:[ { temp: 16.7715882353 }, { temp: 15.6177272727 }, { temp: 14.9965151515 }, { temp: 14.4480666667 }, { temp: 14.2733047619 }, { temp: 14.06976 }, { temp: 13.88201 }, { temp: 13.7168666667 }, { temp: 13.3235333333 }, { temp: 12.3038285714 }, { temp: 11.471648 }, { temp: 10.669248 }, { temp: 9.0997173913 }, { temp: 8.8200493274 }, { temp: 8.4635470852 }, { temp: 8.0872 } ] }";
var dayly = "{ _id: { year: 2015, month: 6, day: 11 },average: 9.21668280226759 }{ _id: { year: 2015, month: 6, day: 12 },average: 9.20343727242744 }";
var weekly = "{ _id: { year: 2016, week: 36 }, average: 15.6361809045226 }{ _id: { year: 2016, week: 37 }, average: 16.337437934458638 }";
var monthly = "{ _id: { year: 2015, month: 6 }, average: 9.99517536038443 }{ _id: { year: 2015, month: 7 }, average: 10.908305776657711 }{ _id: { year: 2015, month: 8 }, average: 11.551303680783505 }{ _id: { year: 2015, month: 5 }, average: 9.307033864850482 }{ _id: { year: 2015, month: 9 }, average: 11.998503821312044 }";
var yearly = "{ _id: { year: 2015 }, average: 11.045805108547766 }{ _id: { year: 2016 }, average: 9.91629408763686 }";

var dateList = [];
var dataList = [];

var list;

removeElements();

function removeElements(){

    input = dayly;

    input = input.replace(/\s/g, "");
    input = input.replace(/{/g, "");
    input = input.replace(/}/g, "");

    list = input.split(/,|_id:|timeseries:\[|\]/);

    addToList();

}

function addToList() {

    var date = "";

    for (var i = 1; i < list.length; i++) {

        if(list[i].indexOf("average") !== -1) {
            dataList.push(parseFloat(list[i].substring(list[i].indexOf(":") + 1)).toFixed(3));
            dateList.push(date.slice(0,-1));
            date = "";
        }
        else {
            date += list[i].substring(list[i].indexOf(":") + 1) + ".";
        }
    }
    buildString();
}

function buildString() {

    var finalString = "";

    for(var i=0;i<dateList.length;i++){
        finalString += dateList[i]+"   ";
        finalString += dataList[i] + "\n";

    }
    console.log(finalString);
}