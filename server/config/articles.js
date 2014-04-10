var mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
    headline : String,
    description : String,
    date : String
});

module.exports = mongoose.model('Articles', articleSchema);