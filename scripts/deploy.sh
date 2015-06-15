#!/bin/bash

branch=$1

if [ ! "$branch" ]
  then
      branch="master"
      echo "branch=master"
fi

echo "### Switch to a branch..."
git checkout -b "$branch"
git pull

echo "### Set permission to user on /tmp/ folder..."
sudo chmod 777 /tmp/

echo "### Parent directory..."
current_dir=$(pwd)

echo "### Install needed packages on front-end..."
cd "../blog/frontend"
#sudo bower install --allow-root
bower install
sudo npm install

echo "### Build front-end..."
grunt build

echo "### Install needed packages on back-end..."
cd "$current_dir"
cd "../blog/backend"
sudo npm install
