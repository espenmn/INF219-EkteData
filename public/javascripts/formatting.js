var input;

var allDataValues = "{ _id:{ year: 2015, month: 6, day: 12, hour: 11, depth: 10.5, value: 8.420125 } }{ _id:{ year: 2015, month: 6, day: 12, hour: 11, depth: 11.5, value: 8.236 } }{ _id:{ year: 2015, month: 6, day: 12, hour: 11, depth: 12.5, value: 7.9263285714 } }";
var dayly = "d: { year: 2015, depth: 10.5 },average: 10.225258897039668 }{ _id: { year: 2015, depth: 11.5 }, average: 9.420034931174158 }{ _id: { year: 2015, depth: 12.5 }, average: 8.752600233766751 }";
var weekly = "";
var monthly = "";
var yearly = "";

var dateList = [];
var dataList = [];
var depthList = [];

var parameter = "";

var list;

removeElements();

function removeElements(){

    input = dayly;

    input = input.replace(/\s/g, "");
    input = input.replace(/{/g, "");
    input = input.replace(/}/g, "");

    list = input.split(/,|_id:|timeseries:\[|\]/);

    /*if(list[0].indexOf("startdatetime") !== -1)
        parameter = list[2].substring(0,list[2].indexOf(":"));*/

    addToList();

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
    buildString();
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
}