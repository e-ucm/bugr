var guid = require('./utils').guid;
var ll = require('./utils').ll;
var Collection = require('easy-collections');

function Api(db) {
    this.activations = new Collection(db, 'activations');
    this.comments = new Collection(db, 'comments');
    // Legacy collections
    this.bugsLegacy = new Collection(db, 'bugsLegacy');
}

Api.prototype.addUser = function (guid, ip) {
    var result = ll(ip) || [null, null];
    return this.activations.insert({guid: guid, ip: ip, lat: result[0], long: result[1]});
};

Api.prototype.newGuid = function () {
    var that = this;
    var id = guid();
    return this.activations.find({guid: id}, true).then(function (result) {
        if (result) {
            return that.newGuid();
        } else {
            return id;
        }
    });
};

/**
 * Activates a new user. Returns the guid
 */
Api.prototype.activate = function (ip) {
    var that = this;
    return this.newGuid().then(function (guid) {
        return that.addUser(guid, ip).then(function () {
            return guid;
        });
    });
};

/**
 * Stores bugs and comments from eAdventure 1.X
 */
Api.prototype.bugLegacy = function (req) {
    if (req.body.type) {
        var collection;
        if (req.body.type === 'comment') {
            collection = this.comments;
        } else if (req.body.type === 'bug') {
            collection = this.bugsLegacy;
        }

        // Ensure is a valid bug report/comment
        if (collection && req.body.version && req.body.file) {
            var report = {
                version: req.body.version,
                file: req.body.file,
                date: new Date()
            };
            return collection.insert(report);
        }
    }

    return Q.fcall(function () {
        throw {
            code: 400
        }
    });
};

Api.prototype.getActivations = function () {
    return this.activations.find();
};

module.exports = Api;