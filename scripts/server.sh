#!/bin/bash

env=$1
port=$2

echo "$env";
echo "$port";

if [ ! "$env" ]
  then
      env="staging"
      echo "env=staging"
fi

if [ ! "$port" ]
  then
      port="3000"
      echo "port=3000"
fi

echo "### Run back-end..."
cd "../blog/backend"

echo "### Stop current instance..."
# forever stop "$env:$port"

echo "### Start new instance..."
forever -a -o server.log --uid "$env:$port" start ./bin/www --env="$env" --port="$port"