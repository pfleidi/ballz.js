/*!
 * Lisp environment
 */

var Functions = require('./native_functions');

var createEnvironment = exports.createEnvironment = function (parent) {
  var env = {};

  function _put(key, value) {
    env[key] = value;
    return value;
  }

  function _get(key) {
    var value = env[key] || Functions[key];

    if (typeof value !== 'undefined') {
      return value;
    } else if (parent) {
      return parent.get(key);
    } else {
      throw new Error('No value bound for key: ' + key);
    }
  }

  return {
    put: _put,
    get: _get,
  };

};
