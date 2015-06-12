#!/bin/bash

branch=$1

if [ ! "$branch" ]
  then
      branch="master"
      echo "branch=master"
fi

echo "### Pull code from github..."
#git clone -b master https://github.com/nhutle/nodejs-blog.git

echo "### Switch to a branch..."
git checkout -b "$branch"
git pull

echo "### Install needed packages on front-end..."
cd "../blog/frontend"
bower install --allow-root
npm install

echo "### Build front-end..."
grunt build

echo "### Install needed packages on back-end..."
cd "../backend"
npm install
