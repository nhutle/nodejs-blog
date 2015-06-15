var plan = require('flightplan');

var appName = 'node-app';
var username = 'deploy';
var startFile = 'bin/www';

var tmpDir = appName + '-' + new Date().getTime();

// configuration
plan.target('staging', [{
  host: 'localhost',
  username: username,
  agent: process.env.SSH_AUTH_SOCK,
  privateKey: '/home/vagrant/.ssh/id_rsa'
}]);

plan.target('production', [{
  host: 'localhost',
  username: username,
  agent: process.env.SSH_AUTH_SOCK,
  privateKey: '/home/vagrant/.ssh/id_rsa'
}]);

plan.remote('install', function(remote) {
  remote.log('----- Install...');
  remote.with('cd nodejs-blog/scripts', function() {
    remote.exec('chmod +x install.sh && sh ./install.sh');
  });
});

plan.remote('server', function(remote) {
  remote.log('----- Server...');
  remote.with('cd nodejs-blog/scripts', function() {
    remote.exec('chmod +x server.sh && sh ./server.sh');
  });
});

plan.remote('deploy', function(remote) {
  remote.log('----- Deploy...');
  remote.with('cd nodejs-blog/scripts', function() {
    remote.exec('chmod +x deploy.sh && sh ./deploy.sh');
  });
});

plan.remote('init', function(remote) {
  remote.log('----- Initialize...');
  remote.with('cd nodejs-blog/scripts', function(){
    remote.exec('chmod +x init.sh && sh ./init.sh');
  });
});

plan.remote('cloneSource', function(remote) {
  remote.log('----- Clone source code from github...');
  remote.exec('git clone -b master https://github.com/nhutle/nodejs-blog.git');
});

plan.remote('pullSource', function(remote) {
  remote.log('----- Pull source code from github...');
  remote.with('cd nodejs-blog', function(){
    remote.exec('git pull origin master');
  });
});

// run commands on remote server
plan.remote(function(remote) {
  // nothing
});

// run commands on localhost
plan.local(function(local) {
  // nothing
});

