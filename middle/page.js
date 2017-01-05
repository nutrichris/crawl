var log = require('log4js').getLogger('route');
var http = require('http');
var url = require('url');
var async = require('async');

var exports = module.exports = {};

exports.get = function(url, next) {
    async.waterfall([
	function(cb) {
	    var context = {
		url: url,
		body: "",
		links: [],
		meta: [], 
		title: [],
		robots: []
	    };
	    return cb(null, context);
	}, 
	download,
	links,
	meta,
	title,
	robots
    ], function(err, context) {
	context.body = "";
	return next(err, context);
    });
};

var download = function(context, next) {
    var url = context.url;
    var options = {
	method: 'GET',
	host: url.host,
	port: url.port, 
	path: url.path
    };

    var callback = function(res) {
	var body = "";
	
	res.on('data', function(data) {
	    body += data;
	});

	res.on('end', function() {
	    if (res.statusCode == 200) {
		context.body = body;
		return next(null, context);
	    } else {
		context.body = "";
		return next(res.statusCode, context);
	    }
	});
    };

    try {
	http.request(options, callback).end();
    } catch(err) {
	return next(err);
    }
};

var links = function(context, next) {
    var lreg = /<a(.*)>(.*)<\/a>/g;
    var hreg = /href=\"([^\"]*)\"/;

    var m = context.body.match(lreg);
    if (m !== null) {
	for (var i = 0; i < m.length; i++) {
	    var hm = m[i].match(hreg);
	    
	    if (hm !== null) {
		context.links.push(hm[1]);
	    }
	}
    }

    return next(null, context);
};

var meta = function(context, next) {
    var lreg = /<meta(.*)\/>/g;

    var m = context.body.match(lreg);
    if (m !== null) {
	for (var i = 0; i < m.length; i++) {
	    context.meta.push(m[i]);
	}
    }

    return next(null, context);
};

var title = function(context, next) {
    var lreg = /<title(.*)>(.*)<\/title>/g;
    var treg = /<title(.*)>(.*)<\/title>/;

    var m = context.body.match(lreg);
    if (m !== null) {
	for (var i = 0; i < m.length; i++) {
	    var tm = m[i].match(treg);
	    if (tm !== null) {
		log.info(tm);
		context.title.push(tm[2]);
	    }
	}
    }

    return next(null, context);
};

var robots = function(context, next) {
    var reg = /<meta.*name="robots".*content="(.*)".*\/>/;
    for (var i = 0; i < context.meta.length; i++) {
	var meta = context.meta[i];

	var m = meta.match(reg);
	if (m !== null) {
	    var ops = m[1].split(',');
	    for (var n = 0; n < ops.length; n++) {
		context.robots.push(ops[n].trim());		
	    }
	}
    }

    return next(null, context);
};
