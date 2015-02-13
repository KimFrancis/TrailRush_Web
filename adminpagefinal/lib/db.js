var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports.mongoose = mongoose;
module.exports.Schema = Schema;

// Connect to cloud database
var username = "bib"
var password = "bib";
var address = '@ds031561.mongolab.com:31561/trailrush';
connect();

// Connect to mongo
function connect() {
var url = 'mongodb://' + username + ':' + password + address;
mongoose.connect(url);
}
function disconnect() {mongoose.disconnect()}