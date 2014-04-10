var express = require('express'),
    passport = require('passport'),
    flash = require('connect-flash');

module.exports = function(app, config) {
    app.configure(function() {
        app.use(express.logger('dev'));
        app.set('views', config.rootPath + '/server/views');
        app.set('view engine', 'ejs');
        app.use(express.cookieParser());
        app.use(express.session({secret: 'article vision unicorns'}));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(express.bodyParser());
        app.use(flash());
        app.use(express.static(config.rootPath + '/public'));
    });
}