var log = require('log4js').getLogger('page_route');
var crawl = require('../middle/crawl.js');

var exports = module.exports = {};

exports.start = function(req, res, next) {
    crawl.start('http://www.orf.at', function(err) {
	if (!err) {
	    return res.status(200).send('started');
	} else {
	    return res.status(500).send(err);
	}
    });
};

exports.list = function(req, res, next) {
    crawl.list(function(err, data) {
	if (!err) {
	    return res.status(200).send(data);
	} else {
	    return res.status(500).send(err);
	}
    });
};

exports.status = function(req, res, next) {
    crawl.status(function(err) {
	if (!err) {
	    return res.status(200).send('status');
	} else {
	    return res.status(500).send(err);
	}
    });
};

exports.next = function(req, res, next) {
    crawl.next(function(err) {
	if (!err) {
	    return res.status(200).send('next');
	} else {
	    return res.status(500).send(err);
	}
    });
};
