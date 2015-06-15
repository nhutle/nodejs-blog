#!/bin/bash

env=$1
port=$2

if [ ! "$env" ]; then
  env="development"
fi

if [ ! "$port" ]; then
  port="80"
fi

echo "---------------------------"
echo "Run Node Server on $env"
echo "---------------------------"

cd "../src/backend/"
forever stop "$env-$port"
forever -a -o server.log --uid "$env-$port" start bin/www --env="$env" --port="$port"