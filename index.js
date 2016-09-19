'use strict';
var redis = require('redis');

var Multi = redis.Multi.prototype;
Multi.exec_transaction = promise(Multi.exec_transaction);
Multi.EXEC = Multi.exec = promise(Multi.exec);

var RedisClient = redis.RedisClient.prototype;
Object.keys(RedisClient).forEach(function (key, index) {
  if (key === 'MULTI') return;
  if (/^[A-Z]+$/.test(key) && typeof RedisClient[key] === 'function') {
    RedisClient[key] = promise(RedisClient[key]);
    RedisClient[key.toLowerCase()] = promise(RedisClient[key.toLowerCase()]);
  }
});
function promise(cmd) {
  return function () {
    var that = this;
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[args.length - 1] === 'function') {
      return cmd.apply(that, args);
    }
    return new Promise(function (resolve, reject) {
      args.push(function (err, value) {
        return err === null ? resolve(value) : reject(err);
      });
      cmd.apply(that, args);
    });
  }
}

redis.createClient = createClient(redis.createClient);
function createClient(cmd) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    return cmd.apply(this, args)
      .on('error', function (err) {
        console.error('redis error: %j', err);
      });
  }
}

module.exports = redis;