var log = require('log4js').getLogger('route');

var express = require('express');
var router = express.Router();

var crawl = require('./crawl_route.js');

router.get('/start', crawl.start);
router.get('/list', crawl.list);
router.get('/status', crawl.status);
router.get('/next', crawl.next);

module.exports = router;
