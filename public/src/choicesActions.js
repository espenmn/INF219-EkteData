/**
 * Created by ady on 23/09/16.
 */
var dataTypes = ["parameterDropDown","howMuchDataDropDown","fromDate","toDate","depthDropDown","depthFrom","depthTo"];

/**
 *
 * This function will change the availability of the selection boxes.
 *
 * @param idFrom
 * @param idTo
 * @param idBox
 */
function changedBox(idFrom,idTo,idBox) {

    if (document.getElementById(idBox).value === "depthBetween") {
        document.getElementById(idFrom).disabled = false;
        document.getElementById(idTo).disabled = false;
    }
    else if (document.getElementById(idBox).value === "oneDepth") {
        document.getElementById(idTo).value = "";
        document.getElementById(idFrom).disabled = false;
        document.getElementById(idTo).disabled = true;
    } else {
        document.getElementById(idFrom).value = "";
        document.getElementById(idTo).value = "";
        document.getElementById(idFrom).disabled = true;
        document.getElementById(idTo).disabled = true;
    }
}

/**
 * Take information from <form id=choices> and print them out on the screen.
 */
function getDataFromTextFields() {

    var dataToQuarry = [];

    for (var i = 0; i < dataTypes.length; i++) {
            dataToQuarry[i] = document.getElementById(dataTypes[i]).value;
    }
    return dataToQuarry;

}

/**
 * Check if the input form the user is valid
 *
 * @param dataList A list of data from user
 * @returns {boolean} True if valid, else false
 */
function validateInput(dataList) {


    //To/From date tests
    var dateType = "";
    var dayAverage = /^([1-9]|1[0-9]|2[0-4])[/](0[1-9]|[1-2][0-9]|3[0-1])[/](0[0-9]|1[0-2])[/]([1-9][0-9])$/;
    var monthAverage = /^(0[0-9]|1[0-2])[/]([1-9][0-9])$/;
    var yearAverage = /^(0[0-9]|1[0-2])[/]([1-9][0-9])$/;


    if(dataList[1] === 'allData' || dataList[1] === '24hourAverage' || dataList[1] === 'weeklyAverage') {
        if (!dayAverage.test(dataList[2])) {
            printError("Invalid date", "The field must contain: HH/DD/MM/YY");
            return false;
        }
        dateType='day';

        if (!dayAverage.test(dataList[3])) {
            printError("Invalid date", "The field must contain: HH/DD/MM/YY");
            return false;
        }
    }
    else if(dataList[1] === 'monthlyAverage'){
        if (!monthAverage.test(dataList[2])) {
            printError("Invalid date", "The field must contain: MM/YY");
            return false;
        }
        dateType='month';

        if (!monthAverage.test(dataList[3])) {
            printError("Invalid date", "The field must contain: MM/YY");
            return false;
        }
    }
    else if(dataList[1] === 'yearlyAverage'){
        if (!yearAverage.test(dataList[2])) {
            printError("Invalid date", "The field must contain: YY");
            return false;
        }
        dateType='year';


        if (!yearAverage.test(dataList[3])) {
            printError("Invalid date", "The field must contain: YY");
            return false;
        }
    } else {
        printError("Invalid input","You have to choose a time period");
        return false;
    }

    checkValidDate(dataList[2],dateType);

    return true;
}

/**
 * Change the date to a format that the database can understand
 *
 * @param date
 * @returns {string}
 */
function formatDate(date) {

    var list = date.split("/");
    var formatedDate;

    formatedDate = 20+list[3]+"-"+list[2]+"-"+list[1]+"T"+list[0]+":00:00Z";

    return formatedDate;
}

/**
 * Return current date as a string1.
 *
 * @return {Date}
 */
function getCurrentDate() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    today = yyyy+mm+dd;

    return today;

}


function checkValidDate(date,dateType) {
    var list = date.split("/");
    var listPosOfMonth = "";
    var listPosOfYear = "";
    var dateHasValues = true;
    switch (dateType){
        case "day":
            //0=hour,1=day,2=month,3=year
            listPosOfMonth = 2;
            listPosOfYear=3;
            break;
        case "month":
            //0=month,1=year
            listPosOfMonth = 0;
            listPosOfYear = 1;
            break;
        case "year":
            //0=year
            listPosOfYear = 0;
            break;
        default:
            break;
    }

    //check that data is available from the given start-date (15-12-05-15)

    if(list[listPosOfYear]>=15){
        if(list[listPosOfYear]==15){
            if((listPosOfMonth==2 || listPosOfMonth==0)&& (list[listPosOfMonth]>=5)){
                if(list[listPosOfMonth]==5) {
                    if (listPosOfMonth = 2 && (list[1] >= 12 )) {
                        if(list[1]==12 && list[0]<15 ){
                            dateHasValues=false;
                        }else{return;}
                    } else {dateHasValues = false;
                    }
                }
            }else{dateHasValues=false;}
        }
    }else{dateHasValues=false;}



    //check that the date is not later than the current date

    if(dateHasValues) {
        //months of 31 days
        if (list[listPosOfMonth] == 1 || list[listPosOfMonth] == 3 || list[listPosOfMonth] == 5 || list[listPosOfMonth] == 7
            || list[listPosOfMonth] == 9 || list[listPosOfMonth] == 10 || list[listPosOfMonth] == 12) {

            if ((listPosOfMonth == 2) && (list[1] > 31)) {
                printError("Invalid date", "Only 31 days in the selected month ");
            }

            //months of 30 days
        } else if (list[listPosOfMonth] == 4 || list[listPosOfMonth] == 6 || list[listPosOfMonth] == 8 || list[listPosOfMonth] == 11) {

            if ((listPosOfMonth == 2) && (list[1] > 30)) {
                printError("Invalid date", "Only 30 days in the selected month ");
            }
        } else if (list[listPosOfMonth] == 2) {
            //if leap year
            if (((list[listPosOfYear] % 4 == 0) && (list[listPosOfYear] % 100 != 0)) || (list[listPosOfYear] % 400 == 0)) {
                if ((listPosOfMonth == 2) && (list[1] > 29)) {
                    printError("Invalid date", "Only 29 days in February in the selected year year");
                }
            }
            else if ((listPosOfMonth == 2) && (list[1] > 28)) {
                printError("Invalid date", "Only 28 days in February in the selected year");
            }
        }

    }else{
        printError("Invalid date", "No data available before 15/12/05/15");
    }



}

/**
 * See what input data we have
 *
 * @param list
 */
function outputTest(list) {
    var string = "";
    for(var i=0;i<list.length;i++){
        string += list[i]+"\n";
    }
    window.alert(string);
}

/**
 * What happens when the user hit the accept button.
 */
function acceptButtonHit() {

    var dataToQuarry = getDataFromTextFields();
    var valid = validateInput(dataToQuarry);

    setParameter(dataToQuarry[0]);

    if(valid){
        dataToQuarry = convertToQueryFormat(dataToQuarry);
        outputTest(dataToQuarry);
        window.alert("hei");
        //var query = new MongoQueries(dataToQuarry[2], dataToQuarry[3],dataToQuarry[5],dataToQuarry[6],dataToQuarry[0]);
    }
}

/**
 *
 * This function is printing out error messages to the user.
 *
 * @param title
 * @param message
 */
function printError(title,message){

    window.alert(title+": "+message)

}


/**
 *
 * Converts the raw data from the user, to a format that the query can use.
 *
 * @param list The list from the user
 * @return {*} A formatted list
 */
function convertToQueryFormat(list){

    list[2] = formatDate(list[2]);
    list[3] = formatDate(list[3]);

    if(list[4] === 'allDepths'){
        list[5] = "0.5";
        list[6] = "18.5";
    }

    if(list[4] === 'oneDepth'){
        list[6] = list[5];
    }

    return list;
}
