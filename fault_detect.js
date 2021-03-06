/*
  FAULT - DETECTION
  This block is responsible for handling the various fault conditions based on fault type
*/

const fs = require('fs');
const faultHandler = require("./fault_clear.js");
const deviceFile = "./log/deviceParam.json";
var deviceList = [];

const detectFault = function (data) {

    /*
        OVER CURRENT FAULTS
        They are non-instantaneos faults, so maximum fault current out of all is taken into consideration
    */
    var max = 0;
    for (i = 0; i < deviceList.length; i++) {
        if (data[deviceList[i]].curr_value > data[deviceList[i]].threshold) {
            fault_point = deviceList[i];
            if (data[deviceList[i]].curr_value > max)
                max = data[deviceList[i]].curr_value;
        }
    }
    if (max > 0) {
        console.log(".......Fault Detected near " + fault_point + ".......");
        faultHandler.clearFault(deviceList.indexOf(fault_point));
    }
};

setInterval(function () {
    payload1 = fs.readFileSync(deviceFile, 'utf8');
    payload1 = JSON.parse(payload1);
    deviceList = Object.keys(payload1);

    detectFault(payload1);
}, 7000);

// call the default blocks at an interval of 5seconds
