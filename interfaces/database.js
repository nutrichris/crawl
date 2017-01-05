var log = require('log4js').getLogger('database');
var process = require('process');

var pg = require('pg');

var exports = module.exports = {};

var client = null;

exports.init = function(config, next) {
    pg.defaults.ssl = true;
    log.info(process.env);
    pg.connect(process.env.DATABASE_URL, function(err, c) {
	client = c;
	return next(err);
    });

};



