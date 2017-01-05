var log = require('log4js').getLogger('host');

var mongoose = require('mongoose');
var mongolastic = require('mongolastic');

var hostSchema = mongoose.Schema({
    name: String
});

var Host = mongoose.model('Host', hostSchema);
try {
    mongolastic.registerModel(Host, function(err, res) {
	log.info("Host model registered in elasticsearch");
    });
} catch(err) {
    log.error(err);
}

module.exports = Host;
