var MongoClient = require('mongodb').MongoClient;

// Connect to the db before starting the server
MongoClient.connect("mongodb://localhost:27017/bugs", function(
    err, database) {
    if (err) {
        console.log('Impossible to start database: ' + err.stack);
    } else {
        var express = require('express'),
            routes = require('./routes'),
            api = require('./routes/api')(databse),
            http = require('http'),
            path = require('path');

        var app = module.exports = express();

        // Express configuration
        app.set('port', process.env.PORT || 80);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(app.router);
        app.use(express.errorHandler());


        // Set api
        app.post('/api/bug', api.bug);
        app.post('/reports.php', api.bugLegacy);

        // Start Server
        http.createServer(app).listen(app.get('port'), function() {
            console.log('Express server listening on port ' + app.get('port'));
        });
    }
});