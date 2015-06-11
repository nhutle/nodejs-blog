#!/bin/bash

env=$1
port=$2
branch=$3

if [ ! "$env" ]
  then
      env="development"
      echo "env=development"
fi

if [ ! "$port" ]
  then
      port="3000"
      echo "port=3000"
fi

if [ ! "$branch" ]
  then
      branch="master"
      echo "branch=master"
fi

echo "### Set permission for scripts..."
sudo chmod u+x install.sh deploy.sh server.sh

echo "### Execute script files..."
echo "### Excute install.sh..."
sh install.sh

echo "### Excute deploy.sh..."
sh deploy.sh $branch

echo "### Excute server.sh..."
sh server.sh $env $port