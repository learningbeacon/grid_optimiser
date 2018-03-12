/*
  FAULT - CLEARANCE
  This block is responsible for handling the various fault conditions based on fault type
*/

const fs = require('fs');
/*
  Get the device list for all available devices
*/
payload = fs.readFileSync("./log/deviceParam.json",'utf8');

payload = JSON.parse(payload);


list = Object.keys(payload);

for(i = 0;i<list.length;i++){
  console.log(payload[list[i]].curr_value);
}


const clearFault = function(name , location){

}
//module.exports.clearFault = clearFault;