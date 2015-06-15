#!/bin/bash

echo '### Sets up all environment variables required for development ...'

# Update
sudo apt-get update

echo '### System requirements ...'

# Install software
sudo apt-get -y install git
sudo apt-get -y install curl
sudo apt-get -y install vim
sudo apt-get -y install g++
sudo apt-get -y install ruby
sudo apt-get -y install rubygems
sudo gem install sass

# Setup NodeJS
echo "### Install Node & npm ..."
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get -y install nodejs
# Update npm
sudo npm -y -g install npm

# Install express-generator
echo "### Install Express generator ..."
sudo npm -g install express-generator

# install mongodb
echo "### Install MongoDB ..."
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get -y update
sudo apt-get install -y mongodb-org=2.6.9 mongodb-org-server=2.6.9 mongodb-org-shell=2.6.9 mongodb-org-mongos=2.6.9 mongodb-org-tools=2.6.9

# Download & Install yo, bower, grunt-cli
echo "### Download & Install bower, grunt-cli ..."
sudo npm -g install bower 
sudo npm -g install grunt-cli
sudo npm -g install forever
sudo npm -g install flightplan