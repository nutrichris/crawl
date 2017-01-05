var log = require('log4js').getLogger('database');
var process = require('process');

var pg = require('pg');

var exports = module.exports = {};

client = null;

exports.init = function(config, next) {
    pg.defaults.ssl = true;
    log.info(process.env);
    pg.connect(process.env.DATABASE_URL, function(err, c) {
	exports.client = c;
	return next(err);
    });

};

var execute = function(command, next) {
    const query = client.query(command);
    var results = [];
    query.on('row', function(row) {
	results.push(row);
    });
    query.on('end', function() {
	return next(null, results);	    
    });
    query.on('error', function(err) {
	return next(err);
    });

};

exports.findOne = function(table, criteria, next) {
    exports.find(client, table, criteria, function(err, results) {
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

exports.find = function(table, criteria, next) {
    if (client !== null) {
	var command = "SELECT * FROM " + table + " WHERE ";
	
	for (var key in criteria) {
	    if (criteria.hasOwnProperty(key)) {
		var obj = criteria[key];
		command += key + "='" + obj + "'";
		
		command += " AND ";
	    }
	    
	}
	command = command.substr(0, command.length - 5) + ";";
	log.info(command);
	execute(command, function(err, data) {
	    return next(err, data);
	});
    } else {
	return next("database connection is null");
    }
};

exports.save = function(table, data, next) {
    if (client !== null) {
	var command = "INSERT INTO " + table + "(";
	var values = "VALUES(";

	for (var key in data) {
	    if (data.hasOwnProperty(key)) {
		var obj = data[key];
		command += key + ", ";
		values += "'" + obj + "', "; 
	    }
	}

	command = command.substr(0, command.length - 2);
	values = values.substr(0, values.length - 2);

	command += ") " + values + ");";
	console.log(command);
	execute(command, function(err, data) {
	    return next(err, data);
	});	
    } else {
	return next("database connection is null");
    }
};
