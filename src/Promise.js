/**
 * @module ES5Promise
 */

function internalThen(fulfilled, rejected) {
    if (arguments.length == 0) {
        throw new TypeError("Not enough arguments!");
    }

    if (typeof fulfilled !== "function") {
        throw new TypeError("Not a function!");
    }

    if (rejected && typeof rejected !== "function") {
        throw new TypeError("Not a function!");
    }

    switch (this.status) {
        case Promise.Status.PENDING:
            return new Promise(function (fulfill, reject) {
                this.callbacks.fulfilled.push(function (value) {fulfilled(value); fulfill(value);});
                this.callbacks.rejected.push(function (reason) {if (rejected) {rejected(reason); } reject(reason);});
            }.bind(this));
        case Promise.Status.FULFILLED:
            return Promise.resolve(this.value);
        case Promise.Status.REJECTED:
            return Promise.reject(this.reason);
    }
}

function internalInform(callbacks, value) {
    var index = 0,
        length = callbacks.length,
        iteratorInterval;

    if (callbacks.length > 0) {
        iteratorInterval = setInterval(function () {
            callbacks[index](value);

            index += 1;

            if (index == length) {
                clearInterval(iteratorInterval);
            }
        })
    }
}

function callPromise(promise, fulfill, reject) {
    if (!Promise.prototype.isPrototypeOf(promise)) {
        promise = Promise.resolve(promise);
    }

    promise.then(fulfill, reject);
}

/**
 * @callback Promise~executor~fulfill
 * @param {*} value
 */
function internalFulfill(value) {
    this.status = Promise.Status.FULFILLED;
    this.value = value;
}

/**
 * @callback Promise~executor~reject
 * @param {*} reason
 */
function internalReject(reason) {
    this.status = Promise.Status.REJECTED;
    this.reason = reason;
}

/**
 * @callback Promise~executor
 * @param {Promise~executor~fulfill} fulfill
 * @param {Promise~executor~reject} reject
 */

/**
 * @constructor
 * @param {Promise~executor} executor
 */
function Promise(executor) {
    if (arguments.length == 0) {
        throw new TypeError("Not enough arguments!");
    }

    if (typeof executor !== "function") {
        throw new TypeError("Not a function!");
    }

    var shared = {
            "callbacks": {
                "fulfilled": [],
                "rejected": []
            },
            "status": Promise.Status.PENDING,
            "value": null,
            "reason": null
        },
        timeout,
        interval;

    Object.defineProperties(this, {
        "status": {
            "enumerable": true,
            "get": function () {
                return shared.status;
            }
        }
    });

    /**
     * @param {Promise~fulfilled} fulfilled
     * @param {Promise~rejected} rejected
     * @returns {Promise}
     */
    this.then = internalThen.bind(shared);

    timeout = setTimeout(function () {
        var fulfill = internalFulfill.bind(shared),
            reject = internalReject.bind(shared);

        try {
            executor(fulfill, reject);
        } catch (error) {
            reject(error);
        } finally {
            clearTimeout(timeout);
        }
    });

    interval = setInterval(function () {
        switch (shared.status) {
            case Promise.Status.PENDING:
                return;
            case Promise.Status.FULFILLED:
                internalInform(shared.callbacks.fulfilled, shared.value); break;
            case Promise.Status.REJECTED:
                internalInform(shared.callbacks.rejected, shared.reason); break;
        }

        clearInterval(interval);
    });
}
Promise.prototype = Object.create(Object.prototype);

/**
 * @callback Promise~fulfilled
 * @param {*} value
 */

/**
 * @callback Promise~rejected
 * @param {*} reason
 */

/**
 * @param {Promise~rejected} rejected
 * @returns {Promise}
 */
Promise.prototype.catch = function (rejected) {
    if (!rejected) {
        throw new TypeError("Not enough arguments!");
    }

    if (typeof rejected !== "function") {
        throw new TypeError("Not a function!");
    }

    return this.then(function () {}, rejected);
};

/**
 * @param {Array} promises
 * @returns {Promise}
 */
Promise.race = function (promises) {
    if (!promises) {
        throw new TypeError("Not enough arguments!");
    }

    if (!Array.isArray(promises)) {
        throw new TypeError("Not an array!");
    }

    return new Promise(function (fulfill, reject) {
        var index = 0,
            length = promises.length,
            interval;

        if (length === 0) {
            fulfill();
        } else {
            interval = setInterval(function () {
                callPromise(promises[index], function (value) {clearInterval(interval); fulfill(value); }, reject);

                index += 1;

                if (index === length - 1) {
                    clearInterval(interval);
                }
            });
        }
    });
};

/**
 * @param {Array} promises
 * @returns {Promise}
 */
Promise.all = function (promises) {
    if (!promises) {
        throw new TypeError("Not enough arguments!");
    }

    if (!Array.isArray(promises)) {
        throw new TypeError("Not an array!");
    }

    return new Promise(function (fulfill, reject) {
        var index = 0,
            length = promises.length,
            fulfilled = 0,
            results = new Array(length),
            interval,
            observer;

        if (length == 0) {
            fulfill(results);
        } else {
            interval = setInterval(function () {
                callPromise(promises[index], function (value) {fulfilled += 1; results[index] = value; }, reject);

                index += 1;

                if (index === length - 1) {
                    clearInterval(interval);
                }
            });

            observer = setInterval(function () {
                if (fulfilled == promises.length) {
                    clearInterval(observer);
                    fulfill(results);
                }
            });
        }
    });
};

/**
 * @param {*} reason
 * @returns {Promise}
 */
Promise.reject = function (reason) {
    return new Promise(function (resolve, reject) {reject(reason); });
};

/**
 * @param {*} value
 * @returns {Promise}
 */
Promise.resolve = function (value) {
    return Promise.prototype.isPrototypeOf(value) ? value : new Promise(function (resolve) {resolve(value); });
};

Object.defineProperty(Promise, "Status", {
    "enumerable": "true",
    "value": Object.freeze({
        "PENDING": "pending",
        "FULFILLED": "fulfilled",
        "REJECTED": "rejected"
    })
});

module.exports = Promise;