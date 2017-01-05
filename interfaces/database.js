var log = require('log4js');
var logger = log.getLogger('database');

var mongoose = require('mongoose');
var mongolastic = require('mongolastic');

var exports = module.exports = {};

var require = function(path) {
    return exports;
};

exports.init = function(config, next) {
    var hosts = config.replSet.hosts;
    var hostString = "";

    for (var i = 0; i < hosts.length; i++) {
	var h = hosts[i];
	hostString += h.name + ":" + h.port;
	if (i < (hosts.length - 1)) {
	    hostString += ",";
	}
    }

    var url = "mongodb://" + hostString + "/" + config.name + '?replicaSet=' + config.replSet.name;
    logger.info("Connecting: " + url);

    mongoose.connect(url);
    mongolastic.connect('crawl', {
	host: "localhost:9200",
	sniffOnStart: false
    }, function(err) {
	if (err) {
	    logger.error(err);
	} else {
	    logger.info("elasitcsearch connect success");
	}
    });    
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error: '));
    db.once('open', function(callback) {
	logger.info('database connected');
	if (next !== null && next !== undefined) {
	    return next(null);
	}
    });
};

exports.clear = function() {
    var db = mongoose.connection;
};

exports.close = function() {
    logger.info('close database');
    mongoose.connection.close();
};
