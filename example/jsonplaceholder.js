var http = require('http'),
    Promise = require("../src/Promise.js");

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
