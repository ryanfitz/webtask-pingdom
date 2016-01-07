'use strict';

var request = require('request'),
    AWS     = require('aws-sdk');

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

internals.createSNSClient = function (data) {
  AWS.config.update({
    accessKeyId: data.KEY_ID,
    secretAccessKey: data.SECRET_ACCESS_KEY,
    region : data.REGION || 'us-east-1'
  });

  return new AWS.SNS();
};

internals.alertHostDown = function (sns, data) {
  var params = {
    TopicArn : 'arn:aws:sns:us-east-1:839951348153:NotifyMe',
    Subject : 'Host Down Alert',
    Message : JSON.stringify(data, null, 2)
  };

  sns.publish(params, function (err) {
    if (err) {
      console.log('failed to publish alert', err);
    }
  });
};

module.exports = function (context, cb) {
  var url = context.data.url || 'https://auth0.com/';

  internals.ping(url, function (err, data) {
    if (err) {
      return cb(err);
    }

    if (data.status === 'DOWN') {
      // send alert in background ignoring errors
      var sns = internals.createSNSClient(context.data);
      internals.alertHostDown(sns, data);
    }

    return cb(null, data);
  });
};
