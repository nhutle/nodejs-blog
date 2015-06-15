#!/bin/bash

echo "### Updating system..."
sudo apt-get update

echo "### Install needed tools..."
# sudo apt-get install git-core python g++ make checkinstall zlib1g-dev zip curl -y
# sudo apt-get install rubygems ruby-dev
sudo apt-get -y install git
sudo apt-get -y install curl
sudo apt-get -y install vim
sudo apt-get -y install g++
sudo apt-get -y install ruby
sudo apt-get -y install rubygems
sudo gem install sass

echo "### Install nodejs..."
sudo apt-get install python-software-properties -y
sudo add-apt-repository ppa:chris-lea/node.js -y
sudo apt-get update
sudo apt-get install nodejs -y

echo "### Update npm to latest version..."
sudo npm update npm -g

echo "### Install backend..."
echo "### Install mongodb..."
# Import the public key used by the package management system.
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

# Create a list file for MongoDB.
echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | sudo tee /etc/apt/sources.list.d/mongodb.list

# Reload local package database.
sudo apt-get update

# Install the MongoDB packages: 2.6.1
sudo apt-get install mongodb-org=2.6.1 mongodb-org-server=2.6.1 mongodb-org-shell=2.6.1 mongodb-org-mongos=2.6.1 mongodb-org-tools=2.6.1 -y

# Pin a specific version of MongoDB.
echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-org-shell hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections

# Install expressjs framework
echo "### Install the expressjs framework..."
sudo npm install express-generator -g

### Install frontend
echo "### Install Yeoman, Grunt CLI and Bower..."
### sudo npm install -g yo --unsafe-perm
sudo npm install -g yo bower grunt-cli -g

#echo "### Install compass..."
# sudo gem install compass

echo "### Install Angular generator..."
sudo npm install -g generator-angular
