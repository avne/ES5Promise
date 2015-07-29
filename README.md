[![Build Status](https://travis-ci.org/avne/ES5Promise.svg?branch=master)](http://travis-ci.org/avne/ES5Promise)
ES5Promise
==========
ECMAScript 5 compatible polyfill for the ECMAScript 2015 (Harmony) promise pattern.
  
```js
var https = require('http'),
    Promise = require("ES5Promise");

console.log("one");
new Promise(function (resolve, reject) {
    var request,
        data = "";

    request = https.request({
        "host": "jsonplaceholder.typicode.com",
        "path": "posts/1",
        "method": "get",
        "headers": {
            "Content-Type": "application/json"
        }
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

## Installation

```bash
$ npm install git+https://git@github.com/avne/ES5Promise.git
```