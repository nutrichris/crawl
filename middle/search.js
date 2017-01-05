var log = require('log4js').getLogger('search');
var db = require('../interfaces/database.js');

var exports = module.exports = {};

exports.search = function(query, next) {
    db.all(function(err, data) {
	if (!err) {
	    var result = [];
	    for (var i = 0; i < data.length; i++) {
		log.info(data[i].title + " / " + query);
		if (data[i].title.indexOf(query) != -1) {
		    log.info("match");
		    result.push(data[i]);
		}
	    }

	    return next(null, result);
	} else {
	    return next(err);
	}
    });
};
