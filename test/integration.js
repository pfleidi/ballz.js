/*!
 * integration test for all components
 */

var Assert = require('assert');
var Vows = require('vows');

var Parser = require('../lib/parser');
var Environment = require('../lib/environment');
var interpreter = require('../lib/interpreter').createInterpreter(
  Environment.createEnvironment()
);

function exec(code, result) {
  var ast = Parser.parse(code);
  var res = interpreter.eval(ast);
  Assert.strictEqual(res, result);
}

Vows.describe('test all components of interpreter').addBatch({
    'some simple calclulations' : {

      '3 + 2 = 5' : function () {
        exec('(+ 3 2)', 5);
      },

      '10 + 2 - 5 = 7' : function () {
        var test = '(- (+ 10 2) 5)';
        exec(test, 7)
      },

      '1 + 2 + 3 + 4 + 5 = 15' : function () {
        var test = '(+ 1 2 3 4 5)';
        exec(test, 15);
      },

      '2 * 2 + 4 * 4 = 20' : function () {
        var test = '(+ (* 2 2) (* 4 4))';
        exec(test, 20);
      }

    } 

  }).export(module);