#!/bin/bash

branch=$1
port=$2
env=$3

if [ ! "$branch" ]; then
  branch="develop"
fi

if [ ! "$port" ]; then
  port="80"
fi

if [ ! "$env" ]; then
  env="development"
fi

sudo chmod +x install.sh deploy.sh server.sh
sh install.sh
sh deploy.sh $branch
sh server.sh $env $port 