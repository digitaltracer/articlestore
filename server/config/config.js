var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        db: 'mongodb://localhost/articlestore',
        rootPath: rootPath,
        port: process.env.PORT || 3000
    },
    production: {
        rootPath: rootPath,
        db: 'mongodb://jim:jim@ds027348.mongolab.com:27348/articlestore',
        port: process.env.PORT || 80
    }
}