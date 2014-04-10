var mongoose = require('mongoose'),
    crypto = require('crypto');

module.exports = function(config) {
    mongoose.connect(config.db);
    console.log('Logging in to DB '+config.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('article store db opened');
    });
   }