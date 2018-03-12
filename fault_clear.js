/*
  FAULT - CLEARANCE
  This block is responsible for handling the various fault conditions based on fault type
*/

var grid_status = require;

const fs = require('fs');
const filename = "./log/deviceParam.json";
/*
  Get the device list for all available devices
*/
var fault_location = [];

const clearFault = function(name){
    payload = fs.readFileSync(filename,'utf8');
    payload = JSON.parse(payload);
    list = Object.keys(payload);
    payload[list[name]].state = 0;
    fault_location.push(name);
    json = JSON.stringify(payload,null,2);

    fs.writeFile(filename, json, 'utf8', function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Written to file!!");
        }
    }); // write it back 
    updateGrid();
    console.log("Reclosure time starts.......");
    setTimeout(function(){
        console.log("Reclosure time ends!.......");
        payload[list[name]].state = 1;
        json = JSON.stringify(payload,null,2);

        fs.writeFile(filename, json, 'utf8', function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("Written to file!!");
            }
    }); // write it back 
        updateGrid();
    },10000);
}

var updateGrid = function(){

}
module.exports.clearFault = clearFault;