var log = require('log4js').getLogger('search_route');
var crawl = require('../middle/crawl.js');

var exports = module.exports = {};

exports.search = function(req, res, next) {
    return res.status(200).send("search");
};

