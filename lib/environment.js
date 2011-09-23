/*!
 * Lisp environment
 */

var Util = require('util');
var Functions = require('./native_functions');

var createEnvironment = exports.createEnvironment = function (parent) {
  var env = {};

  function put(key, value) {
    env[key] = value;
    return value;
  }

  function get(key) {
    var value = env[key] || Functions[key];

    if (typeof value !== 'undefined') {
      return value;
    } else if (parent) {
      return parent.get(key);
    } else {
      throw new Error('No value bound for key: ' + key);
    }
  }

  function toString() {
    return Util.inspect(env, 5);
  }

  return {
    put: put,
    get: get,
    toString: toString
  };

};
