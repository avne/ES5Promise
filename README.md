ES5Promise
==========
ECMAScript 5 compatible polyfill for the ECMAScript 2015 (Harmony) promise pattern.
  
```js
var Promise = require("ES5Promise");

new Promise(function (resolve, reject) {
    resolve("foobar!");
}).then(function (value) {
    console.log(value);
}, function (reason) {
    console.log(reason.message);
});
```

## Installation

```bash
$ npm install git+https://git@github.com/avne/ES5Promise.git
```