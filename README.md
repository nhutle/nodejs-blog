#Follow instructors step by step to install the environment and run the sample
##1. Setup the environment
* cd to the practice folder
* run the command below to install the Vagrant environment
  >vagrant up --provision

##2. Setup needed libraries for the practice
* run the command below to ssh to the Vagrant
  >vagrant ssh
* run the command below to cd to practice folder on the Vagrant
  >cd /vagrant/blog
  * install frontend
  	* run the command below to cd to frontend folder
  		>cd /frontend
  	* run 2 commands below to install needed plugins for frontend
  		>bower install
  		>sudo npm install
  * install backend
  	* run the command below to cd to backend folder
  		>cd ../backend
  	* run the command below to install needed plugin for backend
  		>sudo npm install
##3. Run the pratice
* run the command below to run the practice
  >npm start
* go to **localhost:3000** to see the result.
