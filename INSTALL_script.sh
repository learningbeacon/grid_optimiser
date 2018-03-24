#!/bin/bash


echo "$(tput setaf 3)$(tput bold)############################################################################################################\n\n"
echo "###############                    INSTALLATION FOR ENERGY OPTIMISER                      ##################\n\n"
echo "############################################################################################################\n\n$(tput sgr0)"

if [ -e ./node_modules/ ]
then
	echo "$(tput setaf 2)All required directories are present \n$(tput sgr0)"
else
	echo "\nRequired Directories created... node_modules\n\n"
	mkdir -p node_modules
fi

echo "...................................Checking for AWS_IOT_DEVICE_SDK.........................................."
if [ -e ./node_modules/aws-iot-device-sdk/ ] 
then
        echo "\n\nAWS-SDK already present... so no need to install again....\n\n"
else
	echo "$(tput setaf 1)$(tput bold)AWS_SDK Module not present..... \n\n$(tput sgr0)"
	read -p "Do you want to install sdk? (y/n)" input
	if [ $input = 'y' ]
	then
		npm install aws-iot-device-sdk
	else
		echo "IGNORED... continuing with installation!"
	fi
fi

echo "...................................Checking for SERIAL PORT module.........................................."
if [ -e ./node_modules/serialport/ ] 
then
        echo "\n\nSerial port library  already present... so no need to install again....\n\n"
else
        echo "$(tput setaf 1)$(tput bold)SERIAL PORT Module not present..... \n\n$(tput sgr0)"
        read -p "Do you want to install sdk? (y/n)" input
        if [ $input = 'y' ]
        then
                npm install serialport
        else
                echo "IGNORED... continuing with installation!"
        fi
fi

echo "...................................Checking for WEATHER-JS module.........................................."
if [ -e ./node_modules/weather-js/ ] 
then
        echo "\n\nWEATHER JS module  already present... so no need to install again....\n\n"
else
        echo "$(tput setaf 1)$(tput bold)WEATHER-JS Module not present..... \n\n$(tput sgr0)"
        read -p "Do you want to install sdk? (y/n)" input
        if [ $input = 'y' ]
        then
                npm install weather-js
        else
                echo "IGNORED... continuing with installation!"
        fi
fi

if [ -e ./node_modules/weather-js/ ] && [ -e ./node_modules/serialport/ ] && [ -e ./node_modules/aws-iot-device-sdk/ ]
then
	echo "$(tput setaf 3) ALL MODULES INSTALLED SUCCESSFULLY $(tput bel)$(tput sgr0)"
else
	echo "$(tput setaf 1) ALL MODULES NOT INSTALLED.... check dependency list in INSTALL_INSTRUCTIONS.txt$(tput sgr0)"
fi

echo "$(tput setaf 3)$(tput bold)ALL MODULES ARE READY TO RUN NOW....$(tput sgr0)"

read -p "Would you like to start the application?(y/n) " choice

if [ $choice = 'y' ]
then
        echo "starting your app!!........"
        echo "$(tput setaf 3)$(tput bold)############################################################################################################\n\n"
        echo "###############                    ENERGY OPTIMISER APPLICATION STARTUP                   ##################\n\n"
        echo "############################################################################################################\n\n$(tput sgr0)"
        echo "Running Serial- Port read ....."
        gnome-terminal -e 'node serial_port.js'
        echo "Running fault-detect block ...."
        gnome-terminal -e 'node fault_detect.js'
        echo "Running load balancing block..."
        gnome-terminal -e 'node loadBalance.js'
        echo "AWS_service initialized.........\n\n"
        gnome-terminal -e 'node aws_upload.js'
else
        echo "Finished Installation!!!!  [SUCCESS]"
        echo "You can run your application by running $(tput setaf 2)node main.js $(tput sgr0) from the project directory!!"
fi
