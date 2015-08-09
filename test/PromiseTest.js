// jshint -W030
require("mocha");

var expect = require("chai").expect,
    Promise = require("../src/Promise.js");

describe("ES5Promise", function () {
    describe("constructor", function () {
        it("should fail without arguments", function () {
            expect(function () {new Promise(); }).to.throw(TypeError, /Not enough arguments!/);
        });

        it("should fail, if called with anything else than a function", function () {
            expect(function () {new Promise({}); }).to.throw(TypeError, /Not a function!/);
            expect(function () {new Promise(new Object()); }).to.throw(TypeError, /Not a function!/);
            expect(function () {new Promise([]); }).to.throw(TypeError, /Not a function!/);
            expect(function () {new Promise(new Array()); }).to.throw(TypeError, /Not a function!/);
            expect(function () {new Promise(""); }).to.throw(TypeError, /Not a function!/);
            expect(function () {new Promise(new String()); }).to.throw(TypeError, /Not a function!/);
            expect(function () {new Promise(0); }).to.throw(TypeError, /Not a function!/);
            expect(function () {new Promise(new Number()); }).to.throw(TypeError, /Not a function!/);
            expect(function () {new Promise(true); }).to.throw(TypeError, /Not a function!/);
            expect(function () {new Promise(new Boolean()); }).to.throw(TypeError, /Not a function!/);
            expect(function () {new Promise(/regExp/); }).to.throw(TypeError, /Not a function!/);
            expect(function () {new Promise(new RegExp()); }).to.throw(TypeError, /Not a function!/);
            expect(function () {new Promise(new Date()); }).to.throw(TypeError, /Not a function!/);
            expect(function () {new Promise(new Error()); }).to.throw(TypeError, /Not a function!/);
        });

        it("should construct an instance of Promise", function () {
            var executor = function () {};

            expect(new Promise(executor)).to.be.an.instanceof(Promise);
            expect(Promise.prototype.isPrototypeOf(new Promise(executor))).to.be.true;
        });

        it("should call the given function", function () {
            var executorCalled = false,
                timeout;

            new Promise(function () {
                executorCalled = true;
            });

            timeout = setTimeout(function () {
                expect(executorCalled).to.be.true;
                clearTimeout(timeout);
            }, 1000);
        });

        it("should call the given function with two functions as arguments", function () {
            var executorCalled = false,
                timeout;

            new Promise(function (fulfill, reject) {
                executorCalled = true;
                expect(fulfill).to.be.a.function;
                expect(reject).to.be.a.function;
            });

            timeout = setTimeout(function () {
                expect(executorCalled).to.be.true;
                clearTimeout(timeout);
            }, 1000);
        });

        it("should return before the executor has finished", function () {
            var executorCalled = false,
                t1,
                t2,
                t3,
                timeout;

            t1 = new Date();
            new Promise(function () {
                executorCalled = true;
                var timeout = setTimeout(function () {clearTimeout(timeout); }, 1000);
                t3 = new Date();
            });
            t2 = new Date();

            timeout = setTimeout(function () {
                expect(executorCalled).to.be.true;
                expect(t1).to.be.lessThan(t2);
                expect(t2).to.be.lessThan(t3);
                clearTimeout(timeout);
            }, 1000);
        });
    });

    describe("static reject()", function () {
        describe("accessibility", function () {
            it("should exist", function () {
                expect(Promise.reject).to.exist;
            });

            it("should be a function", function () {
                expect(Promise.reject).to.be.a.function;
            });

            it("should accept one arguments", function () {
                expect(Promise.reject.length).to.equal(1);
            });
        });

        describe("behaviour", function () {
            var promise = Promise.reject(new Error("foobar")),
                timeout;

            it("should return a promise", function () {
                expect(promise).to.be.an.instanceOf(Promise);
            });

            it("should be rejected", function () {
                var resolved = false,
                    rejected = false,
                    reason;

                promise.then(function (value) {
                    resolved = true;
                    expect(value).to.equal("foobar")
                }, function (error) {
                    rejected = true;
                    reason = error;
                });

                timeout = setTimeout(function () {
                    expect(rejected).to.be.true;
                    expect(resolved).to.be.false;
                    expect(reason).to.be.instanceOf(Error);
                    expect(reason.message).to.equal("foobar");
                }, 1000);
            });
        });
    });

    describe("static resolve()", function () {
        describe("accessibility", function () {
            it("should exist", function () {
                expect(Promise.resolve).to.exist;
            });

            it("should be a function", function () {
                expect(Promise.resolve).to.be.a.function;
            });

            it("should accept one arguments", function () {
                expect(Promise.resolve.length).to.equal(1);
            });
        });

        describe("behaviour", function () {
            var promise = Promise.resolve("foobar"),
                timeout;

            it("should return a promise", function () {
                expect(promise).to.be.an.instanceOf(Promise);
            });

            it("should be resolved", function () {
                var resolved = false,
                    rejected = false;

                promise.then(function (value) {
                    resolved = true;
                    expect(value).to.equal("foobar")
                }, function () {
                    rejected = true;
                });

                timeout = setTimeout(function () {
                    expect(resolved).to.be.true;
                    expect(rejected).to.be.false;
                }, 1000);
            });
        });
    });

    describe("then()", function () {
        describe("accessibility", function () {
            var promise;

            it("should exist", function () {
                promise = new Promise(function () {});
                expect(promise.then).to.exist;
            });

            it("should be a function", function () {
                expect(promise.then).to.be.a.function;
            });

            it("should accept two arguments", function () {
                expect(promise.then.length).to.equal(2);
            });
        });

        describe("error handling", function () {
            it("should fail without arguments", function () {
                expect(function () {new Promise(function () {}).then(); }).to.throw(TypeError, /Not enough arguments!/);
            });

            it("should fail, if called with anything else then a function", function () {
                var promise = Promise.resolve("foobar");

                expect(function () {promise.then({}); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.then(new Object()); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.then([]); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.then(new Array()); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.then(""); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.then(new String("")); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.then(0); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.then(new Number(0)); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.then(true); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.then(new Boolean(true)); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.then(/regExp/); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.then(new RegExp()); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.then(new Date()); }).to.throw(TypeError, /Not a function!/);
            });
        });

        describe("fulfilled callback argument", function () {
            it("should register and call the given fulfilled callback with the given value", function () {
                var calls = 0,
                    object = {},
                    array = [],
                    string = "",
                    number = 0,
                    boolean = true,
                    regExp = /regExp/,
                    date = new Date(),
                    error = new Error(),
                    timeout;

                new Promise(function (fulfill) {fulfill("foo", "bar"); }).then(function (value) {
                    calls += 1;
                    expect(arguments.length).to.equal(1);
                    expect(value).to.equal("foo");
                });

                Promise.resolve(object).then(function (value) {calls += 1; expect(value).to.equal(object); });
                Promise.resolve(array).then(function (value) {calls += 1; expect(value).to.equal(array); });
                Promise.resolve(string).then(function (value) {calls += 1; expect(value).to.equal(string); });
                Promise.resolve(number).then(function (value) {calls += 1; expect(value).to.equal(number); });
                Promise.resolve(boolean).then(function (value) {calls += 1; expect(value).to.equal(boolean); });
                Promise.resolve(regExp).then(function (value) {calls += 1; expect(value).to.equal(regExp); });
                Promise.resolve(date).then(function (value) {calls += 1; expect(value).to.equal(date); });
                Promise.resolve(error).then(function (value) {calls += 1; expect(value).to.equal(error); });

                timeout = setTimeout(function () {
                    expect(calls).to.equal(8);
                    clearTimeout(timeout);
                }, 1000);
            });

            it("should register and call the given rejected callback with only one argument", function () {
                var fulfilledCalled = false,
                    timeout;

                Promise.resolve("foo", "bar").then(function (value) {
                    fulfilledCalled = true;
                    expect(arguments.length).to.equal(1);
                    expect(value).to.equal("foo");
                });

                timeout = setTimeout(function () {
                    expect(fulfilledCalled).to.be.true;
                    clearTimeout(timeout);
                }, 1000);
            });
        });

        describe("rejected callback argument", function () {
            it("should register and call the given rejected callback with the given reason", function () {
                var calls = 0,
                    object = {},
                    array = [],
                    string = "",
                    number = 0,
                    boolean = true,
                    regExp = /regExp/,
                    date = new Date(),
                    error = new Error(),
                    timeout;

                new Promise(function (f, reject) {reject("foo", "bar"); }).then(function (reason) {
                    calls += 1;
                    expect(arguments.length).to.equal(1);
                    expect(reason).to.equal("foo");
                });

                new Promise(function (f, reject) {reject(object); }).then(function () {}, function (reason) {expect(reason).to.equal(object); });
                new Promise(function (f, reject) {reject(array); }).then(function () {}, function (reason) {expect(reason).to.equal(array); });
                new Promise(function (f, reject) {reject(string); }).then(function () {}, function (reason) {expect(reason).to.equal(string); });
                new Promise(function (f, reject) {reject(number); }).then(function () {}, function (reason) {expect(reason).to.equal(number); });
                new Promise(function (f, reject) {reject(boolean); }).then(function () {}, function (reason) {expect(reason).to.equal(boolean); });
                new Promise(function (f, reject) {reject(regExp); }).then(function () {}, function (reason) {expect(reason).to.equal(regExp); });
                new Promise(function (f, reject) {reject(date); }).then(function () {}, function (reason) {expect(reason).to.equal(date); });
                new Promise(function (f, reject) {reject(error); }).then(function () {}, function (reason) {expect(reason).to.equal(error); });

                timeout = setTimeout(function () {
                    expect(calls).to.equal(8);
                    clearTimeout(timeout);
                }, 1000);
            });

            it("should register and call the given rejected callback with only one argument", function () {
                var rejectedCalled = false,
                    timeout;

                new Promise(function (f, reject) {reject("foo", "bar"); }).then(function () {}, function (reason) {
                    rejectedCalled = true;
                    expect(arguments.length).to.equal(1);
                    expect(reason).to.equal("foo");
                });

                timeout = setTimeout(function () {
                    expect(rejectedCalled).to.be.true;
                    clearTimeout(timeout);
                }, 1000);
            });
        });
    });

    describe("catch()", function () {
        describe("accessibility", function () {
            var promise;

            it("should exist", function () {
                promise = new Promise(function () {});
                expect(promise.catch).to.exist;
            });

            it("should be a function", function () {
                expect(promise.catch).to.be.a.function;
            });

            it("should one two arguments", function () {
                expect(promise.catch.length).to.equal(1);
            });
        });

        describe("error handling", function () {
            it("should fail without arguments", function () {
                expect(function () {new Promise(function () {}).catch(); }).to.throw(TypeError, /Not enough arguments!/);
            });

            it("should fail, if called with anything else then a function", function () {
                var promise = Promise.reject(new Error("foobar"));

                expect(function () {promise.catch({}); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.catch(new Object()); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.catch([]); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.catch(new Array()); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.catch(""); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.catch(new String("")); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.catch(0); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.catch(new Number(0)); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.catch(true); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.catch(new Boolean(true)); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.catch(/regExp/); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.catch(new RegExp()); }).to.throw(TypeError, /Not a function!/);
                expect(function () {promise.catch(new Date()); }).to.throw(TypeError, /Not a function!/);
            });
        });

        describe("rejected callback argument", function () {
            it("should register and call the given rejected callback with the given reason", function () {
                var object = {},
                    array = [],
                    string = "",
                    number = 0,
                    boolean = true,
                    regExp = /regExp/,
                    date = new Date(),
                    error = new Error();

                Promise.reject(object).catch(function (reason) {expect(reason).to.equal(object); });
                Promise.reject(array).catch(function (reason) {expect(reason).to.equal(array); });
                Promise.reject(string).catch(function (reason) {expect(reason).to.equal(string); });
                Promise.reject(number).catch(function (reason) {expect(reason).to.equal(number); });
                Promise.reject(boolean).catch(function (reason) {expect(reason).to.equal(boolean); });
                Promise.reject(regExp).catch(function (reason) {expect(reason).to.equal(regExp); });
                Promise.reject(date).catch(function (reason) {expect(reason).to.equal(date); });
                Promise.reject(error).catch(function (reason) {expect(reason).to.equal(error); });
            });

            it("should register and call the given rejected callback with only one argument", function () {
                var rejectedCalled = false;

                Promise.reject("foo", "bar").catch(function (reason) {
                    rejectedCalled = true;
                    expect(arguments.length).to.equal(1);
                    expect(reason).to.equal("foo");
                });
            });
        });
    });
});