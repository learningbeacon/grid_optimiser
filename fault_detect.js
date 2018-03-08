const faultHandler = require("./fault_clear.js")
const fs = require('fs');

const deviceList = [];

const detectOverVoltage = function(){
    /*
        OVER VOLTAGE FAULTS
        They are non-instantaneos faults, so maximum fault voltage out of all is taken into consideration
    */

    var max = 0;
    for(i = 0; i < deviceData.length; i++){
        if(deviceData[i].volt_value > deviceData[i].vol_max && deviceData[i].volt_value > max){
            max = deviceData[i].volt_value;
            fault_device = deviceData[i].name;
            fault_point = i;
        }
    }
    if(max > 0){
        console.log(".......Over Voltage Fault Detected near "+ fault_device +".......");
        faultHandler.clearFault(deviceData[fault_point].name,deviceData.indexOf(fault_device));
    }
};

const detectOverCurrent = function(){

    /*
        OVER CURRENT FAULTS
        They are non-instantaneos faults, so maximum fault current out of all is taken into consideration
    */
    
    var max = 0;
    for(i = 0; i < deviceData.length; i++){
        if(deviceData[i].curr_value > deviceData[i].cur_max && deviceData[i].volt_value < 2.0){
            fault_point = deviceData[i].name;
            break;
        }
    }
    if(max > 0){
        console.log(".......Earth Fault Fault Detected near "+ fault_point +".......");
        faultHandler.clearFault(fault_point,deviceData.indexOf(fault_point));
    }
};

const detectEarthFault = function(){
    /*
        EARTH FAULTS
        They are instantaneos faults and needs to be cleared immediately, and one earth fault 
        can cause other nodes to faulter also
    */

    var max = 0;
    for(i = 0; i < deviceData.length; i++){
        if(deviceData[i].curr_value > deviceData[i].cur_max && deviceData[i].curr_value > max){
            max = deviceData[i].volt_value;
            fault_point = deviceData[i].name;
        }
    }
    if(max > 0){
        console.log(".......Over Current Fault Detected near "+fault_point+".......");
        faultHandler.clearFault(fault_point,deviceData.indexOf(fault_point));
    }
    //detectEarthFault();
};

setInterval(function(){
    deviceData = JSON.parse(fs.readFileSync("./log/deviceParam.json"));
    for(i = 0; i<deviceData.length; i++){
        deviceList[i] = deviceData[i].name;
    }
    console.log(deviceList);
    
    detectOverVoltage();

    detectOverCurrent();

    detectEarthFault();
},10000)