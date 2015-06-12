#!/bin/bash

echo "### Updating system..."
apt-get update

echo "### Install needed tools..."
apt-get install git-core python g++ make checkinstall zlib1g-dev zip curl -y

echo "### Install nodejs..."
apt-get install python-software-properties -y
add-apt-repository ppa:chris-lea/node.js -y
apt-get update
apt-get install nodejs -y
npm update npm -g

### install backend
##install mongodb
echo "### Install mongodb..."

#Import the public key used by the package management system.
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

#create a list file for MongoDB.
echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | sudo tee /etc/apt/sources.list.d/mongodb.list

#reload local package database.
apt-get update

#install the MongoDB packages: 2.6.1
apt-get install mongodb-org=2.6.1 mongodb-org-server=2.6.1 mongodb-org-shell=2.6.1 mongodb-org-mongos=2.6.1 mongodb-org-tools=2.6.1 -y

#pin a specific version of MongoDB.
echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-org-shell hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections

### install frontend
echo "### Install Grunt CLI and Bower..."
npm install -g bower grunt-cli -g

echo "### Install compass..."
gem install compass
