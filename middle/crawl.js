var log = require('log4js').getLogger('route');
var url = require('url');
var async = require('async');
var page = require('./page.js');

var db = require('../interfaces/database.js');
var host_model = require('../model/host.js');
var page_model = require('../model/page.js');

var exports = module.exports = {};

var context = {
    running: false,
    todo: [],
    todoNext: []
};
var blackHosts = ["www.facebook.com", 'plus.google.com'];


var find = function(url, next) {
    host_model.findOne(db.client, { name: url.host }, function(err, ret) {
	if (!err) {
	    if (ret) {
		page_model.findOne({
		    path: url.path,
		    host: ret._id
		}, function(err, ret_page) {
		    if (!err) {
			if (ret_page) {
			    return next(null, ret_page); 
			} else {
			    return next(null, null);
			}
		    } else {
			return next(err);
		    }
		});		
	    } else {
		return next(null, null);
	    }
	} else {
	    return next(err);
	}

    });
};


var store = function(data, next) {
    host_model.findOne(db.client, { name: data.url.host }, function(err, ret) {
	async.waterfall([
	    function(cb) {
		if (err == null && ret == null) {
/*
		    var h = new host_model({ name: data.url.host} );
		    h.save(function(err, saved_host) {
			return cb(err, saved_host, data);
		    });
*/
		}
		else if (err == null && ret != null) {
		    return cb(null, ret, data);
		} else {
		    return cb("database read fail");
		}		
	    },
	    function(host, data, cb) {
		return cb(null);
/*
		page_model.findOne({
		    path: data.url.path,
		    host: host._id
		}, function(err, ret) {
		    if (err == null && ret == null) {
			var page = {
			    path: data.url.path,
			    host: host._id
			    };

			var pp = new page_model(page);
			pp.save(function(err, saved_page) {
			    return cb(err);
			});

		    } else if (err == null && ret != null) {
			return cb(null);
		    } else {
			return cb(err);			
		    }
		});
*/
	    }
	], function(err) {
	    return next(err);
	});
    });
};

exports.start = function(location, next) {
    if (context.running === false) {
	log.info('start: ' + location);
	var uu = url.parse(location);
	
	context.running = true;
	page.get(uu, function(err, data) {
	    if (!err) {
		context.todo = context.todo.concat(data.links);
		store(data, function(err) {
		    if (err) {
			log.warn(err);
		    }
		});
	    } else {
		log.info(err);
	    }
	    
	    context.running = false;
	});
	return next(null);
    } else {
	return next("is already running");
    }
};

exports.next = function(next) {
    if (context.running === false) {
	log.info('next iteration');
	context.todoNext = context.todo;
	context.todo = [];

	context.running = true;
	async.eachSeries(context.todoNext, function(link, cb) {
	    log.info("processing: " + link);
	    var uu = url.parse(link);

	    if (uu.host !== null && uu.protocol == "http:") {
		if (blackHosts.indexOf(uu.host) === -1) {
		    find(uu, function(err, saved_page) {
			if (!err) {
			    if (!saved_page) {
				page.get(uu, function(err, data) {
				    if (!err) {
					store(data, function(err) {
					    if (err) {
						log.warn(err);
					    } else {
						context.todo = context.todo.concat(data.links);
					    }
					    return cb(null);
					});
				    } else {
					log.warn(err);
					return cb(null);
				    }
				});
			    } else {
				return cb(null);
			    }
			} else {
			    return cb(err);
			}
		    });
		} else {
		    return cb(null);
		}
	    } else {
		return cb(null);
	    }
	}, function(err) {
	    if (err) {
		log.error(err);
	    }
	    context.todoNext = [];
	    context.running = false;
	    log.info("next done");
	});
	return next(null);
    } else {
	return next("is already running");
    }
};

exports.list = function(next) {
    log.info('list');
    return next(null, context.todo);
};

exports.status = function(next) {
    log.info('status');
    return next(null, context.running);
};
