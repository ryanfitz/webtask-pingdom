'use strict';

var request = require('request');

var internals = {};

internals.ping = function (url, callback) {
  var startTime = Date.now();

  request(url, function (error, response) {
    if (error) {
      return callback(error) ;
    }

    var elapsed = Date.now() - startTime;

    var result = {url: url, latency : elapsed, statusCode: response.statusCode};

    if (response.statusCode < 400) {
      result.status = 'UP';
    } else {
      result.status = 'DOWN';
    }

    return callback(null, result);
  });
};

module.exports = function (context, cb) {
  var url = context.data.url || 'https://auth0.com/';

  internals.ping(url, function (err, data) {
    if (err) {
      return cb(err);
    }

    return cb(null, data);
  });
};
