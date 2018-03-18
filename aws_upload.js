var awsIot = require('aws-iot-device-sdk');
var fs = require('fs');
//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT.
// NOTE: client identifiers must be unique within your AWS account; if a client attempts 
// to connect with a client identifier which is already in use, the existing 
// connection will be terminated.
//
var device = awsIot.device({
   keyPath: './AWS_keys/880b4ce37f-private.pem.key',
  certPath: './AWS_keys/880b4ce37f-certificate.pem.crt',
    caPath: './AWS_keys/rootCA.pem',
  clientId: 'energyoptimiser',
      host: 'a1at9zut3gj0ze.iot.us-west-2.amazonaws.com'
});

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
setInterval(function(){
  device
  .on('connect', function() {
    console.log('connect');
    device.subscribe('energyPolicy');
    load =fs.readFileSync("./deviceParam.json",'utf8');
    load = JSON.parse(load);
    device.publish('energyPolicy', JSON.stringify(load));
  });
},4500);

/*
 This piece of code sends the data from the JSON file storing device data regularly at an interval of 4.5 sec
  to AWS cloud... it gets stored in a dynamoDB database...
*/


device
  .on('message', function(topic, payload) {
      payload = JSON.parse(payload);
    console.log('message', topic, payload.message);
  });