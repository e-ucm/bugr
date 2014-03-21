module.exports = function(db) {

    var error = function(res, err) {
        console.log('Error:' + err.stack);
        res.send(500);
    };

    // Functions to create GUID
    var s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    var guid = function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    var findGuid = function(req, res) {
        var id = guid();
        db.collection('activations').find({
            guid: id
        }).toArray(function(err, result) {
            if (err) {
                error(err);
                return;
            }

            if (result.length === 0) {
                var ip = req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress || 'Unknown';
                // The id is not repeated
                db.collection('activations').insert({
                    guid: id,
                    ip: ip
                }, function(err, result) {
                    if (err) {
                        error(err);
                        return;
                    }

                    res.status(200);
                    res.send(id);
                });
            } else {
                findGuid(req, res);
            }
        });
    };



    return {
        // Method to support eadventure bug tracking
        bug: function(req, res) {
            db.collection('bugs').insert(req.body, function(err, result) {
                if (err) {
                    console.log('Error adding bug to database ' + err.stack);
                    res.send(500);
                } else {
                    res.send(204);
                }
            });
        },
        // Method to support eadventure-legacy bug tracking/comments
        bugLegacy: function(req, res) {
            if (req.body.type) {
                var collection;
                if (req.body.type === 'comment') {
                    collection = 'comment';
                } else if (req.body.type === 'bug') {
                    collection = 'bugsLegacy';
                }

                // Ensure is a valid bug report/comment
                if (collection && req.body.version && req.body.file) {
                    var report = {
                        version: req.body.version,
                        file: req.body.file,
                        date: new Date()
                    };
                    db.collection(collection).insert(report, function(err, result) {
                        if (err) {
                            console.log('Error adding report to database ' + err.stack);
                            res.send(500);
                        } else {
                            res.send(204);
                        }
                    });
                } else {
                    res.send(400);
                }
            } else {
                res.send(400);
            }
        },
        // Activates a new eAdventure installation; Returns an identifier for the user
        activate: function(req, res) {
            findGuid(req, res);
        }
    }
};