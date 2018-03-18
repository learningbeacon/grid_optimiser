//This is only a reference implemetation. Actual implementaion may vary

'use strict';

console.log('Loading function');

var AWS = require('aws-sdk');  
AWS.config.region = '<add your location>';
snsTopicARN = '<add your ARN for SNS topic Subscription>';
regionSet = '<add ur location>';

const docClient = new AWS.DynamoDB.DocumentClient({region: regionSet});

var deviceList = [];

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    deviceList = Object.keys(event);
    checkFault(event);
    
    var activeSource = dectectActiveSrc(event); //detect active sources
    
    //create the argument for data upload to cloud DB
    var Params = {
        TableName : 'energyRecord',
        Item: {
            Date: Date.now(),
            ActiveSource: activeSource,
            Sensor1: event['sensor1'].curr_value,
            Sensor2: event['sensor2'].curr_value,
            Sensor3: event['sensor3'].curr_value,
            Sensor4: event['sensor4'].curr_value,
            Sensor5: event['sensor5'].curr_value
        }
    };
    
    docClient.put(Params,function(err,data){
        if(err){
            callback(err,null);
        }
    });
    
    callback(null, event.key1);  // Echo back the first key value
};

var checkFault = function(payload){
    var i;
    var max = 0;
    var point = "";
    
    for(i = 0; i < deviceList.length; i++){
        if(payload[deviceList[i]].curr_value > payload[deviceList[i]].threshold && payload[deviceList[i]].curr_value > max){
            max = payload[deviceList[i]].curr_value;
            point = deviceList[i];
        }
    }
    
    if(max > 0){
        sendNotify(point, max);
    }
};

var sendNotify = function(location, value){
    var sns = new AWS.SNS();
    
    var message = "There has been an abnormal fault condition at ";
    message = message + location + " with a fault value of " + value + " KA.....";
    
    sns.publish({
        Message: message,
        Subject: 'Alarm from Energy Optimiser',
        TopicArn: snsTopicARN
    }, function(err, data) {
        if (err) {
            console.log(err.stack);
            return;
        }
        console.log('push sent');
        console.log(data);
        //context.done(null, 'Function Finished!');  
    });
};

var dectectActiveSrc = function(payload){
    if(payload[deviceList[2]].state == 0){
        return "BOTH";
    }
    else if(payload[deviceList[0]].state == 1 && payload[deviceList[4]].state == 0){
        return "UTILITY";
    }
    else if(payload[deviceList[0]].state == 0 && payload[deviceList[4]].state == 1){
        return "PV";
    }
    else{
        return "NONE";
    }
};
