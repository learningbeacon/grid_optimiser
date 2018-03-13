/*
    LOAD BALANCING BLOCK -  This block is responsible for switching between the sources
*/

var fs = require('fs');
var SerialPort = require('serialport');
var weather = require('weather-js');

//import required files
const devfile = "./log/deviceParam.json";
const srcfile = "./log/sourceParam.json";

var sourceList = [];
var voltage = [];

setInterval(function(){
    //regulates at an interval of 20sec 
    payload = fs.readFileSync(srcfile,'utf8');
    payload = JSON.parse(payload);
    sourceList = Object.keys(payload);
    console.log(sourceList);
    getUpdatedValues(payload);        //get updated records

    var max = 0;
    activeSource = "";

    for(i = 0; i < sourceList.length; i++){
        if(payload[sourceList[i]].curr_value > payload[sourceList[i]].threshold && payload[sourceList[i]].curr_value > max){
            max = payload[sourceList[i]].curr_value;
            activeSource = sourceList[i];
        }
    }
    console.log("Active source now is "+activeSource.toUpperCase()+" ......");
    payload = fs.readFileSync(devfile,'utf8');
    payload = JSON.parse(payload);
    if(payload['sensor3'].state == 0){
        payload['sensor1'].state = 1;
        payload['sensor5'].state = 1;
    }
    else{
        if(activeSource == "utility"){
            payload['sensor1'].state = 1;
            payload['sensor5'].state = 0;
        }
        else if(activeSource == "pv"){
            payload['sensor1'].state = 0;
            payload['sensor5'].state = 1;
        }
        else{
            payload['sensor1'].state = 0;
            payload['sensor5'].state = 0;
        }
    }
    write2file(payload);
    updateGrid(payload);
},2000);

function getUpdatedValues(data){
    for(i = 0; i < sourceList.length; i++){
        if(sourceList[i] == "pv"){
            //get weather, compute voltage and store..

        }
        else{
            voltage[i] = data[sourceList[i]].curr_value;
        }
    }
    //end of block
}

var write2file = function(value){
    json = JSON.stringify(value,null,2);

        fs.writeFile(devfile, json, 'utf8', function(err){
            if(err){
                console.log(err);
            }
        }); // write it back 
}

var updateGrid = function(data){
    var output = "";
    var list = Object.keys(data);
    const Readline = SerialPort.parsers.Readline;
    //recon the port
    const port = new SerialPort(portname,{baudRate: 9600});

    //create the parser - detecting the delimitter
    const parser = port.pipe(new Readline({delimiter: '\r\n'}));

    for(i = 0; i < list.length; i++){
        if(i == 2){
            output = output + (data[list[i]].state).toString() + "," + (data[list[i]].state).toString() + ",";
        }
        else{
            output = output + (data[list[i]].state).toString() + ",";
        }
    }
    port.write(output); //write to the serial port
    console.log(output);
}
