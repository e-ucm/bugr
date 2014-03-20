module.exports = function(db) {
    return {
        bug: function(req, res) {
            db.collection('bugs').insert(req.body, function(err, result) {
                if (err) {
                    console.log('Error adding bug to database ' + err.stack);
                    res.send(500);
                } else {
                    res.send(204);
                }
            });
        }
    }
};