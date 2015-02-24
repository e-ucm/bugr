var geoip = require('geoip-lite');

// Functions to create GUID
var s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

module.exports = {
    guid: function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },
    ip: function (req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    },
    /**
     * Returns array with ip latitude and longitude
     */
    ll: function (ip) {
        var result = ip ? geoip.lookup(ip) : null;
        return result ? result.ll : null;
    }
}
