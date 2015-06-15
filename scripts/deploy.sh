#!/bin/bash

branch=$1

if [ ! "$branch" ]; then
  branch="develop"
fi

# Pull source code & build code
echo "### Pull source code & build code ..."
git checkout "$branch"
git pull

# Install frontend dependencies
current_dir=$(pwd)

echo "#### Install frontend dependencies ..."
cd "../blog/frontend"
sudo npm install
bower install --allow-root
echo "#### Build frontend source code ..."
grunt build

# Install backend dependencies
echo "#### Install backend dependencies ..."
cd "$current_dir"
cd "../blog/backend"
sudo npm install