var MongoClient = require('mongodb').MongoClient;
var Api = require('./api');
var ip = require('./utils').ip;
var config = require('./config');

function processPromise(promise, res) {
    promise.then(function (result) {
        res.send(result);
    }).fail(function (err) {
        if (err.code) {
            res.send(err.code);
        } else {
            res.send(500);
        }
    });
}

// Connect to the db before starting the server
MongoClient.connect("mongodb://localhost:27017/bugs", function (err, database) {
    if (err) {
        console.log('Impossible to start database: ' + err.stack);
    } else {
        var api = new Api(database);
        var express = require('express'),
            http = require('http'),
            path = require('path');

        var session = require('express-session');
        var app = module.exports = express();


        // Express configuration
        app.set('port', process.env.PORT || 3000);
        app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(app.router);
        app.use(express.errorHandler());

        // Set api
        app.post('/api/activate', function (req, res) {
            processPromise(api.activate(ip(req)), res);
        });

        app.post('/reports.php', function (req, res) {
            processPromise(api.bugLegacy(req), res);
        });

        app.post('/login', function (req, res) {
            if (req.body.username == config.username && req.body.password == config.password) {
                req.session.username = req.body.username;
                res.redirect('activations.html');
            } else {
                res.redirect('login.html');
            }
        });

        app.all('/data/*', function (req, res, next) {
            if (req.session && req.session.username) {
                next();
            } else {
                res.send(401);
            }
        });

        app.get('/data/activations', function (req, res) {
            processPromise(api.getActivations(), res);
        });

        // Start Server
        console.log('Trying to start server in port ' + app.get('port'));
        http.createServer(app).listen(app.get('port'), function () {
            console.log('Express server listening on port ' + app.get('port'));
        });
    }
});