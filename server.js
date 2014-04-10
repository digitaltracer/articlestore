var express = require('express');
var app = express(),
    passport = require('passport');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./server/config/config')[env];
//console.log(config.db + ' <> '+ rootPath + ' <> '+port);
require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./server/config/passport')(passport);
require('./server/config/routes')(app,passport);
app.listen(config.port);
