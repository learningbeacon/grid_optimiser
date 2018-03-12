/*
    READ SENSOR DATA 
    This program reads the specific data values from sensors and stores them in the form of a JSON
*/
const fs = require('fs');

const deviceData = require("./log/deviceParam.json");
const sourceData = require("./log/sourceParam.json");

portname = '/dev/ttyACM0';
deviceFile = "./log/deviceParam.json";
sourceFile = "./log/sourceParam.json";

var deviceList = []; 
var sourceList = [];

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
 //recon the port
const port = new SerialPort(portname,{baudRate: 9600});

//create the parser - detecting the delimitter
const parser = port.pipe(new Readline({delimiter: '\r\n'}));

var sen = []; // store sensor value

//continuously running function that 
setInterval(function(){
    console.log('Reading input from sensors.........');
    //parser to read the sensor params
    parser.on('data',function(data){
        //console.log(data);
        for(i=0; data.length>0; i++){
            var val = parseFloat(data.slice(0,data.indexOf(",")));
            sen[i] = val;
            data = data.slice((data.indexOf(",")+1),data.length);
        }
    });
    if(sen.length>0){    //update sensor data to file
        console.log("Writing now...");
        updateRecord(deviceFile,deviceList,sen.slice(0,5));
        updateRecord(sourceFile,sourceList,sen.slice(5,7));
    }
    console.log(sen);  //print the readings from the sensors on the console    
},3000);

//Update the list of devices available (nodes in the network)
deviceList = Object.keys(deviceData);
sourceList = Object.keys(sourceData);


var updateRecord = function(filename,label,list){
    payload = fs.readFileSync(filename,'utf8');

    payload = JSON.parse(payload);

    for(i = 0;i < list.length; i++){
        payload[label[i]].curr_value = list[i];
    }

    json = JSON.stringify(payload,null,2);

    fs.writeFile(filename, json, 'utf8', function(err){
        if(err){
            console.log(err);
        }
    }); // write it back 
};
