var log = require('log4js').getLogger('host');

var exports = module.exports = {};

exports.findOne = function(client, criteria, next) {
    exports.find(criteria, next);
}

exports.find = function(client, criteria, next) {
    if (client !== null) {
	var command = "SELECT * FROM hosts WHERE ";
	
	for (var key in criteria) {
	    if (criteria.hasOwnProperty(key)) {
		var obj = criteria[key];
		command += key + "=\"" + obj + "\"";
		
		command += " AND ";
	    }
	    
	}
	command = command.substr(0, command.length - 5) + ";";
	log.info(command);
	return next(null, command);
    } else {
	return next("database connection is null");
    }
};
