// jshint -W030
require("mocha");

var expect = require("chai").expect,
    Promise = require("../src/Promise.js");

describe("ES5Promise", function () {
    var notAFunctionError = new TypeError("Not a function!");

    describe("constructor", function () {
        it("should fail without arguments", function () {
            expect(function () {new Promise(); }).to.throw(TypeError, /Not enough arguments!/);
        });

        it("should fail, if called with anything else than a function", function () {
            expect(function () {new Promise({}); }).to.throw(notAFunctionError);
            expect(function () {new Promise(new Object()); }).to.throw(notAFunctionError);
            expect(function () {new Promise([]); }).to.throw(notAFunctionError);
            expect(function () {new Promise(new Array()); }).to.throw(notAFunctionError);
            expect(function () {new Promise(""); }).to.throw(notAFunctionError);
            expect(function () {new Promise(new String()); }).to.throw(notAFunctionError);
            expect(function () {new Promise(0); }).to.throw(notAFunctionError);
            expect(function () {new Promise(new Number()); }).to.throw(notAFunctionError);
            expect(function () {new Promise(true); }).to.throw(notAFunctionError);
            expect(function () {new Promise(new Boolean()); }).to.throw(notAFunctionError);
            expect(function () {new Promise(/regExp/); }).to.throw(notAFunctionError);
            expect(function () {new Promise(new RegExp()); }).to.throw(notAFunctionError);
            expect(function () {new Promise(new Date()); }).to.throw(notAFunctionError);
            expect(function () {new Promise(new Error()); }).to.throw(notAFunctionError);
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

    describe("static enum Promise.Status", function () {
        describe("accessibility", function () {
            it("should exist", function () {
                expect(Promise.Status).to.exist;
            });

            it("should be an object", function () {
                expect(Promise.Status).to.be.an.object;
            });
        });

        describe("value PENDING", function () {
            it("should exist", function () {
                expect(Promise.Status.PENDING).to.exist;
            });

            it("should be an object", function () {
                expect(Promise.Status.PENDING).to.be.a.string;
            });

            it("should equal 'pending'", function () {
                expect(Promise.Status.PENDING).to.equal("pending");
            });
        });

        describe("value FULFILLED", function () {
            it("should exist", function () {
                expect(Promise.Status.FULFILLED).to.exist;
            });

            it("should be an object", function () {
                expect(Promise.Status.FULFILLED).to.be.a.string;
            });

            it("should equal 'pending'", function () {
                expect(Promise.Status.FULFILLED).to.equal("fulfilled");
            });
        });

        describe("value REJECTED", function () {
            it("should exist", function () {
                expect(Promise.Status.REJECTED).to.exist;
            });

            it("should be an object", function () {
                expect(Promise.Status.REJECTED).to.be.a.string;
            });

            it("should equal 'pending'", function () {
                expect(Promise.Status.REJECTED).to.equal("rejected");
            });
        });
    });

    describe("property status", function () {
        describe("accessibility", function () {
            it("should exist", function () {
                expect((new Promise(function () {})).status).to.exist;
            });

            it("should be a string", function () {
                expect((new Promise(function () {})).status).to.be.a.string;
            });
        });

        describe("behaviour", function () {
            it("should be equal to Promise.Status.PENDING", function () {
                expect((new Promise(function () {})).status).to.equal(Promise.Status.PENDING);
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
            var promise = Promise.resolve("foobar");

            it("should return a promise", function () {
                expect(promise).to.be.an.instanceOf(Promise);
            });

            it("should have a status equal to Promise.Status.FULFILLED", function () {
                expect(promise.status).to.equal(Promise.Status.FULFILLED);
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

            it("should fail, if called with anything else than a function", function () {
                var promise = Promise.resolve("foobar");

                expect(function () {promise.then({}); }).to.throw(notAFunctionError);
                expect(function () {promise.then(new Object()); }).to.throw(notAFunctionError);
                expect(function () {promise.then([]); }).to.throw(notAFunctionError);
                expect(function () {promise.then(new Array()); }).to.throw(notAFunctionError);
                expect(function () {promise.then(""); }).to.throw(notAFunctionError);
                expect(function () {promise.then(new String("")); }).to.throw(notAFunctionError);
                expect(function () {promise.then(0); }).to.throw(notAFunctionError);
                expect(function () {promise.then(new Number(0)); }).to.throw(notAFunctionError);
                expect(function () {promise.then(true); }).to.throw(notAFunctionError);
                expect(function () {promise.then(new Boolean(true)); }).to.throw(notAFunctionError);
                expect(function () {promise.then(/regExp/); }).to.throw(notAFunctionError);
                expect(function () {promise.then(new RegExp()); }).to.throw(notAFunctionError);
                expect(function () {promise.then(new Date()); }).to.throw(notAFunctionError);
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
});