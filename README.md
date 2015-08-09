
ES5Promise
==========
[![Build Status](https://travis-ci.org/avne/ES5Promise.svg?branch=master)](http://travis-ci.org/avne/ES5Promise)

ECMAScript 5 compatible polyfill for the ECMAScript 2015 (Harmony) promise pattern.

Installation
------------
Use `npm` to install ES5Promise to your dependencies folder.
```bash
$ npm install git+https://git@github.com/avne/ES5Promise.git
```
Once the installation is done, you can require ES5Promise inside your scripts to use it. 
```js
var Promise = require("ES5Promise");
```

Testing
-------
To test the module, type the following into a terminal to install all dependencies that are required for testing.
```bash
$ npm install
```
Once this is done use the `test` npm script to start the test suite.
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
    console.log("Calling jsonplaceholder REST API");

    http.get("http://jsonplaceholder.typicode.com/posts/1", function(response) {
        var data = "";

        response.setEncoding("utf-8");

        response.on("data", function(chunk) {
            console.log("data chunk received: " + chunk);
            data += chunk;
        });

        response.on("end", function() {
            console.log("transfer finished");
            resolve(data);
        });
    }).on("error", function(error) {
        console.error("An error occurred: " + error.message);
        reject(error);
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

### FireFox, Chrome, Safari, Opera and Internet Explorer 9+
```js
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