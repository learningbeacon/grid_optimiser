
/*
 * Pin details
 */
int relay_pin[] = {53, 51, 49, 47, 43, 45}; //digital pins for the relays
int curr_sensor_pin[] = {6, 5, 4, 3, 2};    //Analog pins for the current sensors (0-5V)
int vol_sensor_pin[] = {0, 1};              //Analog pins for the voltage sensors (0-5V)
/*
 * Record details of voltage and current
 */
float sensorData[7];  // sensor data captured on board 
int relayData[6];   //relay triggering data received from the framework
int index = 0;
/*
 * Current sensor Calibration data
 */
//current sensor calibration details
double Voltage = 0;
double VRMS = 0;
double AmpsRMS = 0;
int mVperAmp = 100; // for the 20A module , hall effect current amplification value after calibration

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600); // communication mode set as serial
  for(int i = 0;i<6;i++){
    pinMode(relay_pin[i],OUTPUT);
  }
}

void loop() {
  String incomingByte = "";
  // put your main code here, to run repeatedly:
  if(Serial.available()> 0){
    incomingByte = Serial.readString();
    formOperation(incomingByte);  // convert the incoming string to a set of values
  }
  else{
    //send sensor data to the framework
    updateSensors();
    String sending = formDataSet();
    Serial.println(sending);
  }
}

void updateSensors(){
  int i, j;
  float curr_sensor_read[5];
  float vol_sensor_read[2];
  int pointer = 0;
  
  //Serial.print("Enter all current sensor readings : \t");
  for (i = 0; i < 5; i++)
  {
    curr_sensor_read[i] = read_current(curr_sensor_pin[i]);
    sensorData[pointer] = curr_sensor_read[i];
    pointer++;
  }
  //Serial.print("\nEnter all voltage sensor readings : \t");
  for (j = 0; j < 2; j++)
  {
    vol_sensor_read[j] = read_voltage(vol_sensor_pin[j]);
    sensorData[pointer] = vol_sensor_read[i];
    pointer++;
  }
}

String formDataSet(){
  String output = "";
  int i;
  for(i = 0; i < 7; i++){
    String val = String(sensorData[i]);
    output = output+val+",";
  }
  return output;
}

void formOperation(String input){
  while(index < 6){
    String buff = input.substring(0,input.indexOf(','));
    relayData[index]= buff.toInt();
    input = input.substring(input.indexOf(',')+1,input.length());
    index++;
  }
  index =0;
}

/*
 * This is the part of the code that deals with sensor data acquisation
 */

double read_current(int sensorIn)
{
  int readValue;       //value read from the sensor
  int maxValue = 0;    // store max value here
  int minValue = 1024; // store min value here

  uint32_t start_time = millis();
  while ((millis() - start_time) < 1000) //sample for 1 Sec
  {
    readValue = analogRead(sensorIn);
    // see if you have a new maxValue
    if (readValue > maxValue)
    {
      /*record the maximum sensor value*/
      maxValue = readValue;
    }
    if (readValue < minValue)
    {
      /*record the maximum sensor value*/
      minValue = readValue;
    }
  }

  // Subtract min from max
  Voltage = ((maxValue - minValue) * 5.0) / 1024.0;
  VRMS = (Voltage / 2.0) * 0.707;
  AmpsRMS = (VRMS * 1000) / mVperAmp;
  return AmpsRMS;
}

float read_voltage(int pin){
  float R1 = 30000;   //voltage divider constants
  float R2 = 7500;

  int value = analogRead(pin);
  float vout = (value*5)/1024;
  float vin = vout/(R2/(R1+R2));
  return vin; 
}
