var log = require('log4js').getLogger('page');

var mongoose = require('mongoose');
var mongolastic = require('mongolastic');

var pageSchema = mongoose.Schema({
    path: String,
    title: String,
    keys: [String],
    score: Number,
    host: {
	type: mongoose.Schema.Types.ObjectId, 
	ref: 'Host'
    }
});

var Page = mongoose.model('Page', pageSchema);
try {
    mongolastic.registerModel(Page, function(err, res) {
	log.info("Page model registered in elasticsearch");
    });
} catch(err) {
    logger.error(err);
}

module.exports = Page;
