#!/bin/bash


echo "$(tput setaf 3)$(tput bold)############################################################################################################"
echo "###############                    INSTALLATION FOR ENERGY OPTIMISER                      ##################"
echo "############################################################################################################$(tput sgr0)"

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
	echo "$(tput setaf 3) ALL MODULES INSTALLED SUCCESSFULLY$(tput sgr0)"
else
	echo "$(tput setaf 1) ALL MODULES NOT INSTALLED.... check dependency list in INSTALL_INSTRUCTIONS.txt$(tput sgr0)"
fi

