var log = require('log4js').getLogger('search_route');
var search = require('../middle/search.js');

var exports = module.exports = {};

exports.search = function(req, res, next) {
    var query = req.query.q;

    if (query !== undefined && query !== null) {
	search.search(query, function(err, result) {
	    if (!err) {
		var content = "";
		for (var i = 0; i < result.length; i++) {
		    var line = "<a href=\"http://";
		    line += result[i].name + result[i].path + "\">" + result[i].title + "</a><br/";
		    content += line;
		}

		var page = "<html><head></head><body>" + content + "</body></html>";

		return res.status(200).send(page);
	    } else {
		return res.status(500).send(err);
	    }
	});
    } else {
	return res.status(500).send("Please search for something");
    }

};

