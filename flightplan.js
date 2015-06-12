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

plan.remote('deploy', function(transport) {
  transport.log('----- Move folder to root...');
});

plan.local('deploy', function(transport) {
  transport.log('----- Move folder to root...');
});

plan.remote(['default', 'deploy'], function(transport) {

});

// run commands on localhost
plan.local(['default', 'deploy'], function(transport) {
  // nothing
});

// run commands on remote hosts (destinations)
// plan.remote(['default', 'cloneSource'], function(remote) {
//   remote.log('----- Move folder to root...');
// });
//
plan.remote('cloneSource', function(remote) {
  remote.log('----- Clone source code from github...');
  remote.exec('git clone -b master https://github.com/nhutle/nodejs-blog.git');
});

plan.remote('pullSource', function(remote) {
  remote.log('----- Clone source code from github...');
  remote.exec('cd nodejs-blog && git pull origin master');
});

plan.remote('init', function(remote) {
  remote.log('----- Initialize...');
  remote.exec('cd nodejs-blog/scripts && sh init.sh');
  // remote.exec('ls -la');
  // remote.exec('init.sh');
  // remote.exec('sh init.sh');
});