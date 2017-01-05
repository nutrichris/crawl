var log = require('log4js').getLogger('route');

var express = require('express');
var router = express.Router();

var crawl = require('./crawl_route.js');
var search = require('./search_route.js');

router.get('/start', crawl.start);
router.get('/list', crawl.list);
router.get('/status', crawl.status);
router.get('/next', crawl.next);

router.get('/search', search.search);

module.exports = router;
