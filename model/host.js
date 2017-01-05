var log = require('log4js').getLogger('host');

var exports = module.exports = {};

exports.findOne = function(client, criteria, next) {
    exports.find(client, criteria, function(err, results) {
	if (!err) {
	    if (results.length > 0) {
 		return next(null, results[0]);
	    } else {
		return next(null, null);
	    }
	} else {
	    return next(err);
	}
    });
}

exports.find = function(client, criteria, next) {
    if (client !== null) {
	var command = "SELECT * FROM hosts WHERE ";
	
	for (var key in criteria) {
	    if (criteria.hasOwnProperty(key)) {
		var obj = criteria[key];
		command += key + "='" + obj + "'";
		
		command += " AND ";
	    }
	    
	}
	command = command.substr(0, command.length - 5) + ";";
	log.info(command);
	const query = client.query(command);
	var results = [];
	query.on('row', function(row) {
	    results.push(row);
	});
	query.on('end', function() {
	    return next(null, results);	    
	});
    } else {
	return next("database connection is null");
    }
};

