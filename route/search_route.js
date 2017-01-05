var log = require('log4js').getLogger('search_route');
var search = require('../middle/search.js');

var exports = module.exports = {};

exports.search = function(req, res, next) {
    search.search("winter", function(err, result) {
	if (!err) {
	    return res.status(200).send(result);
	} else {
	    return res.status(500).send(err);
	}
    });
};

