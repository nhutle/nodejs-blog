#!/bin/bash

echo "### Set permission for scripts..."
sudo chmod u+x install.sh deploy.sh server.sh

echo "### Execute script files..."
echo "### Excute install.sh..."
sh install.sh

echo "### Excute deploy.sh..."
sh deploy.sh

echo "### Excute server.sh..."
sh server.sh