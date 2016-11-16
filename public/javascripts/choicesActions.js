var dataTypes = ["parameterDropDown", "howMuchDataDropDown", "fromDate", "toDate", "depthDropDown", "depthFrom", "depthTo"];
/**
 *
 * This function will change the availability of the selection boxes.
 *
 * @param idFrom
 * @param idTo
 * @param idBox
 */
function changedBox(idFrom, idTo, idBox) {

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

    var dataToQuery = [];

    for (var i = 0; i < dataTypes.length; i++) {
        dataToQuery[i] = document.getElementById(dataTypes[i]).value;
    }
    return dataToQuery;

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
    var dayAverage = /^(0[1-9]|1[0-9]|2[0-4])[/](0[1-9]|[1-2][0-9]|3[0-1])[/](0[0-9]|1[0-2])[/]([1-9][0-9])$/;
    var monthAverage = /^(0[0-9]|1[0-2])[/]([1-9][0-9])$/;
    var yearAverage = /^([1-9][0-9])$/;
    var absoluteStartDate = "15/12/05/15";

    if (dataList[1] === 'allData' || dataList[1] === '24hourAverage' || dataList[1] === 'weeklyAverage') {
        if (!dayAverage.test(dataList[2])) {
            printError("Invalid date", "The field must contain: HH/DD/MM/YY");
            return false;
        }
        if (!dayAverage.test(dataList[3])) {
            printError("Invalid date", "The field must contain: HH/DD/MM/YY");
            return false;
        }
        dateType = 'day';
    }
    else if (dataList[1] === 'monthlyAverage') {
        if (!monthAverage.test(dataList[2])) {
            printError("Invalid date", "The field must contain: MM/YY");
            return false;
        }
        if (!monthAverage.test(dataList[3])) {
            printError("Invalid date", "The field must contain: MM/YY");
            return false;
        }
        dateType = 'month';
        absoluteStartDate = "05/15";
    }
    else if (dataList[1] === 'yearlyAverage') {
        if (!yearAverage.test(dataList[2])) {
            printError("Invalid date", "The field must contain: YY");
            return false;
        }
        if (!yearAverage.test(dataList[3])) {
            printError("Invalid date", "The field must contain: YY");
            return false;
        }
        dateType = 'year';
        absoluteStartDate = "15";
    } else {
        printError("Invalid input", "You have to choose a time period");
        return false;
    }

    //first date is after 15/12/05/15
    var legalFirstDate = checkDate1BeforeDate2(absoluteStartDate, dataList[2], dateType);
    //last date is before tha date today
    var legalSecondDate = checkDate1BeforeDate2(dataList[3], getCurrentDate(dateType), dateType);
    //the first date is before the second date
    var legalStartEndDates = checkDate1BeforeDate2(dataList[2], dataList[3], dateType);

    if (!legalFirstDate || !legalSecondDate || !legalStartEndDates) {
        if (!legalStartEndDates) {
            printError("Invalid date", "Not possible to place end-date earlier than start-date");
        }
        else if(!legalFirstDate){
            printError("Invalid date", "No data available before 15/12/05/15");
        }
        else {
            printError("Invalid date", "End-date cannot be later than the current date");
        }return false;
    }

    //validate that in "depth between", the first depth is less than the second depth
    if(dataList[4] === 'depthBetween'){
        if(!assertCorrectGapInDepths(dataList[5],dataList[6])){
            printError("Invalid depths", " the start depth cannot be a higher value than the end depth");
            return false;
        }

    }
    return true;
}

/**
 *
 * Change the date to a format that the database can understand
 *
 * @param date
 * @param type
 * @return {*}
 */
function formatDate(date,type) {

    var list = date.split("/");
    var formattedDate;

    if(type) {
        switch (list.length) {
            case 1:
                formattedDate = "20" + list[0] + "-01-01T00:00:00Z";
                break;
            case 2:
                formattedDate = "20" + list[1] + "-" + list[0] + "-01T00:00:00Z";
                break;
            case 3:
                formattedDate = 20 + list[2] + "-" + list[1] + "-" + list[0] + "T00:00:00Z";
                break;
            case 4:
                formattedDate = 20 + list[3] + "-" + list[2] + "-" + list[1] + "T" + list[0] + ":00:00Z";
                break;
        }
    } else {
        switch (list.length) {
            case 1:
                formattedDate = "20" + list[0] + "-12-31T23:59:59Z";
                break;
            case 2:
                formattedDate = "20" + list[1] + "-" + list[0] + "-31T23:59:59Z";
                break;
            case 3:
                formattedDate = 20 + list[2] + "-" + list[1] + "-" + list[0] + "T23:59:59Z";
                break;
            case 4:
                formattedDate = 20 + list[3] + "-" + list[2] + "-" + list[1] + "T" + list[0] + ":00:00Z";
                break;
        }
    }

    return formattedDate;
}

/**
 * Return current date as a string.
 * format: hh/dd/mm/yy
 *
 * @return {Date}
 */
function getCurrentDate(dateType) {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yy = today.getFullYear().toString().substr(2, 2);
    var hh = today.getHours();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    if(dateType == "month") {
        today = (mm + "/" + yy);
    }
    else if (dateType == "year") {
        today = (yy);
    }
    else
        today = (hh + "/" + dd + "/" + mm + "/" + yy);
    return today;

}
/**
 * takes in two dates and checks that the first date occurs earlier than the second one
 * Also calls checkValidDate to assert that both dates are legal/existing dates
 *
 *
 * @param date1 the first/earliest date to check
 * @param date2 the second/latest date to check
 * @param dateType how much data which has been selected
 * @returns {boolean}
 */
function checkDate1BeforeDate2(date1, date2, dateType) {
    var list1 = date1.split("/");
    var list2 = date2.split("/");
    var listPosOfMonth = "";
    var listPosOfYear = "";

    switch (dateType) {
        case "day":
            //0=hour,1=day,2=month,3=year
            listPosOfMonth = 2;
            listPosOfYear = 3;
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


    var valid1 = checkValidDate(list1, listPosOfMonth, listPosOfYear);
    var valid2 = checkValidDate(list2, listPosOfMonth, listPosOfYear);
    if (valid1 && valid2) {
        //Return true if the two dates are equal
        for(var i=0; i<list1.length; i++){
            if (parseInt(list1[i]) != parseInt(list2[i])){
                break;

            }
            if(i==list1.length-1){
                return true;
            }
        }

        //check that date1 comes after date2:
        if (list2[listPosOfYear] >= list1[listPosOfYear]) {
            if (list2[listPosOfYear] == list1[listPosOfYear]) {
                if ((listPosOfMonth == 2 || listPosOfMonth == 0) && (list2[listPosOfMonth] >= list1[listPosOfMonth])) {
                    if (list2[listPosOfMonth] == list1[listPosOfMonth]) {
                        if (listPosOfMonth == 2 && (list2[1] >= list1[1] )) {
                            if (list2[1] == 12 && list2[0] < list1[0]) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }

    } else {
        return false;
    }
    return true;
}


/**
 *
 * takes in a date and checks that it is a valid date according to the Gregorian calendar
 *
 * @param list The date to validate
 * @param listPosOfMonth the position of the month-value in list
 * @param listPosOfYear the position of the year-value in list
 * @returns {boolean}
 */
function checkValidDate(list, listPosOfMonth, listPosOfYear) {
    //months of 31 days
    if (list[listPosOfMonth] == 1 || list[listPosOfMonth] == 3 || list[listPosOfMonth] == 5 || list[listPosOfMonth] == 7
        || list[listPosOfMonth] == 9 || list[listPosOfMonth] == 10 || list[listPosOfMonth] == 12) {

        if ((listPosOfMonth == 2) && (list[1] > 31)) {
            printError("Invalid date", "Only 31 days in the selected month ");
            return false;
        }

        //months of 30 days
    } else if (list[listPosOfMonth] == 4 || list[listPosOfMonth] == 6 || list[listPosOfMonth] == 8 || list[listPosOfMonth] == 11) {

        if ((listPosOfMonth == 2) && (list[1] > 30)) {
            printError("Invalid date", "Only 30 days in the selected month ");
            return false;
        }
    } else if (list[listPosOfMonth] == 2) {
        //if leap year
        if (((list[listPosOfYear] % 4 == 0) && (list[listPosOfYear] % 100 != 0)) || (list[listPosOfYear] % 400 == 0)) {
            if ((listPosOfMonth == 2) && (list[1] > 29)) {
                printError("Invalid date", "Only 29 days in February in the selected year year");
                return false;
            }
        }
        else if ((listPosOfMonth == 2) && (list[1] > 28)) {
            printError("Invalid date", "Only 28 days in February in the selected year");
            return false;
        }
    }
    return true;
}

/**
 * See what input data we have
 *
 * @param list
 */
function outputTest(list) {
    var string = "";
    for (var i = 0; i < list.length; i++) {
        string += list[i] + "\n";
    }
}

/**
 * What happens when the user hit the accept button.
 */

function acceptButtonHit() {
    var dataToQuery = getDataFromTextFields();
    var valid = validateInput(dataToQuery);

    if (valid) {
        dataToQuery = convertToQueryFormat(dataToQuery);
        outputTest(dataToQuery);
        //getQueryValues(dataToQuery[0],dataToQuery[1],dataToQuery[2],dataToQuery[3],dataToQuery[5],dataToQuery[6]);
        runQuery(dataToQuery);
    }
}

/**
 *
 * This function is printing out error messages to the user.
 *
 * @param title
 * @param message
 */
function printError(title, message) {

    window.alert(title + ": " + message)

}

/**
 *
 * @param depth1 the start-depth
 * @param depth2 the the end-depth
 * @returns {boolean} True if the end-depth is deeper than the start-depth
 */
function assertCorrectGapInDepths(depth1, depth2){
    if(parseInt(depth1)>parseInt(depth2)){
        return false;
    }
    return true;
}

/**
 *
 * Converts the raw data from the user, to a format that the query can use.
 *
 * @param list The list from the user
 * @return {*} A formatted list
 */
function convertToQueryFormat(list) {

    list[2] = formatDate(list[2],true);
    list[3] = formatDate(list[3]);


    if (list[4] === 'allDepths' || list[4] === 'VerticalAverage') {
        list[5] = "0.5";
        list[6] = "18.5";
    }

    return list;
}

function runQuery(req) {
    //var hostLink = 'http://localhost:3000';
    var hostLink = 'http://ektedata.herokuapp.com';
    if(req[4]==='VerticalAverage') {
        $.get(hostLink + '/api/' + req[1] + req[4], {
            parameter: req[0],
            dataType: req[1],
            fromDate: req[2],
            toDate: req[3],
            depthFrom: req[5],
            depthTo: req[6]
        }, function (res) {
            getStringFromBackEnd(res);
        });
    }

    else if(req[0]==="airtemp") {
        $.get(hostLink + '/api/' + req[1] + "VerticalAverage", {
            parameter: req[0],
            dataType: req[1],
            fromDate: req[2],
            toDate: req[3],
            depthFrom: req[5],
            depthTo: req[6]
        }, function (res) {
            getStringFromBackEnd(res);
        });
    }

    else {
        $.get(hostLink + '/api/' + req[1], {
            parameter: req[0],
            dataType: req[1],
            fromDate: req[2],
            toDate: req[3],
            depthFrom: req[5],
            depthTo: req[6]
        }, function (res) {
            getStringFromBackEnd(res);
        });
    }
}