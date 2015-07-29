[![Build Status](https://travis-ci.org/avne/ES5Promise.svg?branch=master)](http://travis-ci.org/avne/ES5Promise)

ES5Promise
==========
ECMAScript 5 compatible polyfill for the ECMAScript 2015 (Harmony) promise pattern.

Installation
------------
Use npm to install ES5Promise to your dependencies folder.
```bash
$ npm install git+https://git@github.com/avne/ES5Promise.git
```
Once the installation is done, simply require ES5Promise inside your scripts to use it. 
```js
var Promise = require("");
```

Testing
-------
To test the module, type the following into a terminal to install all dependencies that are required for testing.
```bash
$ npm install
```
Once this is done use the `test` to start the test suite.
```bash
$ npm test
```

Examples
--------
### node.js and io.js
```js
var http = require('http'),
    Promise = require("ES5Promise");

new Promise(function (resolve, reject) {
    var request,
        data = "";

    request = http.request({
        "host": "jsonplaceholder.typicode.com",
        "path": "posts/1",
        "method": "get"
    }, function(response) {
        response.setEncoding("utf-8");

        response.on("data", function(chunk) {
            data += chunk;
        });
        
        response.on("end", function() {
            resolve(data);
        });
        
        response.on("error", function(error) {
            reject(error);
        });
    });
}).then(function (data) {
    console.log(data);
}, function (reason) {
    console.log(reason.message);
});
```
or use the npm `example` script to run the example
```bash
$ npm run example
```
### FireFox, Chrome, Safari, Opera, Internet Explorer
```js
var http = require('http'),
    Promise = require("ES5Promise");

new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();

    request.open("GET", "http://jsonplaceholder.typicode.com/posts/1", true);
    request.onload = resolve;
    request.onerror = reject;
    request.send();
}).then(function (data) {
    console.log(data);
}, function (reason) {
    console.log(reason.message);
});
```