/*
  FAULT - CLEARANCE
  This block is responsible for handling the various fault conditions based on fault type
*/

const SerialPort = require('serialport');

var portname = "/dev/ttyACM0"
const fs = require('fs');
const filename = "./log/deviceParam.json";
/*
  Get the device list for all available devices
*/
var fault_location = [];
var list = [];

const clearFault = function(name){
    payload = fs.readFileSync(filename,'utf8');
    payload = JSON.parse(payload);
    list = Object.keys(payload);
    payload[list[name]].state = 0;
    write2file(payload);
    updateGrid(payload);
    console.log("Reclosure time starts.......");
    setTimeout(function(){
        console.log("Reclosure time ends!.......");
        payload = fs.readFileSync(filename,'utf8');
        payload = JSON.parse(payload);
        payload[list[name]].state = 1;
        write2file(payload);
        updateGrid(payload);
    },10000);
}

var updateGrid = function(data){
    var output = "";
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

var write2file = function(value){
    json = JSON.stringify(value,null,2);

        fs.writeFile(filename, json, 'utf8', function(err){
            if(err){
                console.log(err);
            }
        }); // write it back 
}
module.exports.clearFault = clearFault;