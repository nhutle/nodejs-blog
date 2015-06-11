#!/bin/bash

echo "### Updating system..."
sudo apt-get update

echo "### Install needed tools..."
sudo apt-get install git-core python g++ make checkinstall zlib1g-dev zip curl -y

echo "### Install nodejs..."
sudo apt-get install python-software-properties -y
sudo add-apt-repository ppa:chris-lea/node.js -y
sudo apt-get update
sudo apt-get install nodejs -y
sudo npm update npm -g

### install backend

### install frontend
echo "### Install Yeoman, Grunt CLI and Bower..."
sudo npm install -g bower grunt-cli -g

echo "### Install compass..."
sudo gem install compass
