var http = require('http'),
    Promise = require("ES5Promise");

new Promise(function (resolve, reject) {
    http.get("http://jsonplaceholder.typicode.com/posts/1", function(response) {
        var data = "";

        response.setEncoding("utf-8");

        response.on("data", function(chunk) {
            data += chunk;
        });

        response.on("end", function() {
            resolve(data);
        });
    }).on("error", function(error) {
        reject(error);
    });
}).then(function (data) {
    console.log(data);
}, function (reason) {
    console.log(reason.message);
});
