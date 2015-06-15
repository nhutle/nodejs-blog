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

echo "### Install needed packages on front-end..."
cd
cd "blog/frontend"
#sudo bower install --allow-root
bower install
sudo npm install

echo "### Build front-end..."
grunt build

echo "### Install needed packages on back-end..."
cd "../backend"
sudo npm install
