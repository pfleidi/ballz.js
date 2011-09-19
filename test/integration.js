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
    },

    'test boolean expressions' : {
      '1 == 1' : function () {
        var test = '(eq? 1 1)';
        exec(test, true);
      },

      '1 === 2' : function () {
        var test = '(eq? 1 2)';
        exec(test, false);
      }
    },

    'test conditional expressions' : {

      'if (1 === 1)' : function () {
        var test = '(if (eq? 1 1) #t #f)';
        exec(test, true);
      },

      'if (1 === 2)' : function () {
        var test = '(if (eq? 1 2) #t #f)';
        exec(test, false);
      },

      'cond without else 1' : function () {
        var test = '(cond ((eq? 1 2) "a") ((eq? 2 2) "b")';
        exec(test, 'b');
      },

      'cond without else 2' : function () {
        var test = '(cond ((eq? 1 1) "a") ((eq? 2 2) "b")';
        exec(test, 'a');
      },

      'cond with else 1' : function () {
        var test = '(cond (#f "should not happen") (else "test"))';
        exec(test, 'test');
      },

      'cond with else 2' : function () {
        var test = '(cond (#f "a") (#f "b") (#t "c") (else "test"))';
        exec(test, 'c');
      }

    }

  }).export(module);
