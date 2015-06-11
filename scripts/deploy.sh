#!/bin/bash

echo "### Pull code from github..."
git clone -b master https://github.com/nhutle/nodejs-blog.git

echo "### Switch to a branch..."

echo "### Install needed packages on front-end..."
cd "../blog/frontend"
bower install --allow-root
sudo npm install

echo "### Build front-end..."
grunt build

echo "# Install needed packages on back-end..."
cd "../backend"
sudo npm install