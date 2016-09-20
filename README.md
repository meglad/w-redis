# w-redis

[![npm](https://img.shields.io/npm/v/w-redis.svg)](https://www.npmjs.com/package/w-redis)
[![license](https://img.shields.io/npm/l/w-redis.svg)](https://www.npmjs.com/package/w-redis)
## node-redis 扩展补充 Promise 对象 ([node-rdis 文档](http://redis.js.org/))

## 说明

> w-redis 的指令方法最后一个回调参数有与 node-redis 功能一样

> w-redis 的指令方法最后一个无回调参数 将返回Promise对象

## 安装

> $ npm install w-redis

## 使用

```js
var config = {
  host: '127.0.0.1',
  port: 6379,
  db: 0
};

var redis = require('w-redis');
var client = redis.createClient(config);
var key = 'key:test';
new Promise(function (resolve, reject) {
  resolve();
}).then(function () {
  return client.select(1);
}).then(function (reply) {
  console.log('#0 %j', reply);
  return client.set(key, 'value #1');
}).then(function (reply) {
  console.log('#1 %j', reply);
  return client.get(key);
}).then(function (reply) {
  console.log('#2 %j', reply);
  return client.multi([
    ['zadd', 'key:test:zset', 1, 'one'],
    ['zadd', 'key:test:zset', 2, 'two'],
    ['zadd', 'key:test:zset', 3, 'three'],
    ['zrange', 'key:test:zset', 0, -1, 'WITHSCORES']
  ]).exec();
}).then(function (reply) {
  console.log('#3 %j', reply);
  return client.multi()
    .set(key, 'value #2')
    .get(key)
    .exec();
}).then(function (replys) {
  client.quit();
  console.log('replys: %j', replys);
}).catch(function (err) {
  client.quit();
  console.error('error: %j', err.message);
});
```
