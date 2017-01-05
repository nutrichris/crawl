var log = require('log4js').getLogger('search_route');
var search = require('../middle/search.js');

var exports = module.exports = {};

exports.search = function(req, res, next) {
    var query = req.query.q;

    if (query !== undefined && query !== null) {
	search.search("winter", function(err, result) {
	    if (!err) {
		return res.status(200).send(result);
	    } else {
		return res.status(500).send(err);
	    }
	});
    } else {
	return res.status(500).send("Please search for something");
    }

};

