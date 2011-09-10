/*!
 * Environment unit tests
 */

var Vows = require('vows');
var Assert = require('assert');
var Environment = require('../lib/environment');

var key1 = 'myKey1';
var val1 = 'myVal1';
var key2 = 'myKey2';
var val2 = 'myVal1';
var val2 = 'myVal2';
var key3 = 'myKey3';
var val3 = 'myVal3';


Vows.describe('test environment').addBatch({

    'test environemnt bindings' : function () {
      var env = Environment.createEnvironment();
      Assert.ok(env);
      env.put(key1, val1);
      env.put(key2, val2);
      Assert.strictEqual(env.get(key1), val1);
      Assert.strictEqual(env.get(key2), val2);
    },

    'test environment bindings with parent' : function () {
      var par = Environment.createEnvironment();
      par.put(key1, val1);
      var env = Environment.createEnvironment(par);
      env.put(key2, val2);

      Assert.strictEqual(env.get(key1), val1);
      Assert.strictEqual(env.get(key2), val2);
      Assert.throws(
        function () {
          env.get('noDefinedKey');
        },
        /No value bound for key/
      );
    },

    'test environment with deeper hierarchy' : function () {
      var par = Environment.createEnvironment();
      par.put(key1, val1);
      var secPar = Environment.createEnvironment(par);
      secPar.put(key2, val2);
      var env = Environment.createEnvironment(secPar);
      env.put(key3, val3);

      Assert.strictEqual(env.get(key1), val1);
      Assert.strictEqual(env.get(key2), val2);
      Assert.strictEqual(env.get(key3), val3);
      Assert.throws(
        function () {
          env.get('noDefinedKey');
        },
        /No value bound for key/
      );
    }

  }).export(module)

