var log = require('log4js').getLogger('crawl');
var async = require('async');
var express = require('express');
var cookie_parser = require('cookie-parser');
var body_parser = require('body-parser');
var config = require('./config.json');
var db = require('./interfaces/database.js');

log.info('Lonnie crawl 1.0');


async.waterfall([
    function(cb) {
	log.info('init db');

	db.init(config.db, function(err) {
	    return cb(err);
	});
    }, function(cb) {
	var app = express();
	app.use(cookie_parser());
	app.use(body_parser.json());

	app.use('/', require('./route'));

	var server = app.listen(8080, function() {
	    var host = server.address().address;
	    var port = server.address().port;

	    log.info('crawler listening at ' + host + "@" + port);
	});
    }
], function(err) {
    if (err) {
	log.error('crawl exited with error: ' + err);
    }
});
