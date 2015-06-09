var path = require('path'),
  nconf = require('nconf'),
  rfr = require('rfr'),
  log = rfr('utils/log');

nconf.argv()
  .env()
  .file({
    file: path.join(__dirname, '/../config/local.json')
  });

log.info('Start with this configuration:', nconf.stores.file.file);

module.exports = nconf;
