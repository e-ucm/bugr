var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/bugs", function(
    err, database) {
    if (err) {
        console.log('Impossible to start database: ' + err.stack);
    } else {

        /**
         * Module dependencies
         */

        var express = require('express'),
            routes = require('./routes'),
            api = require('./routes/api')(databse),
            http = require('http'),
            path = require('path');

        var app = module.exports = express();

        /**
         * Configuration
         */

        // all environments
        app.set('port', process.env.PORT || 3000);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(app.router);

        // development only
        if (app.get('env') === 'development') {
            app.use(express.errorHandler());
        }

        // production only
        if (app.get('env') === 'production') {}

        app.post('/api/bug', api.bug);
        // Start Server
        http.createServer(app).listen(app.get('port'), function() {
            console.log('Express server listening on port ' + app.get('port'));
        });
    }
});