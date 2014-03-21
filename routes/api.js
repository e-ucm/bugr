module.exports = function(db) {
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
        }
    }
};