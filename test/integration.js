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

function exec(code) {
  var ast = Parser.parse(code);
  return interpreter.eval(ast);
}

function execAssert(code, result) {
  var res = exec(code);
  Assert.strictEqual(res, result);
}

Vows.describe('test all components of interpreter').addBatch({
    'some simple calclulations' : {

      '3 + 2 = 5' : function () {
        execAssert('(plus 3 2)', 5);
      },

      '10 + 2 - 5 = 7' : function () {
        var test = '(minus (plus 10 2) 5)';
        execAssert(test, 7)
      },

      '1 + 2 + 3 + 4 + 5 = 15' : function () {
        var test = '(plus 1 2 3 4 5)';
        execAssert(test, 15);
      },

      '2 * 2 + 4 * 4 = 20' : function () {
        var test = '(plus (multiply 2 2) (multiply 4 4))';
        execAssert(test, 20);
      }
    },

    'test boolean expressions' : {
      '1 == 1' : function () {
        var test = '(eq? 1 1)';
        execAssert(test, true);
      },

      '1 === 2' : function () {
        var test = '(eq? 1 2)';
        execAssert(test, false);
      }
    },

    'test conditional expressions' : {

      'if (1 === 1)' : function () {
        var test = '(if (eq? 1 1) #t #f)';
        execAssert(test, true);
      },

      'if (1 === 2)' : function () {
        var test = '(if (eq? 1 2) #t #f)';
        execAssert(test, false);
      },

      'cond without else 1' : function () {
        var test = '(cond ((eq? 1 2) "a") ((eq? 2 2) "b")';
        execAssert(test, 'b');
      },

      'cond without else 2' : function () {
        var test = '(cond ((eq? 1 1) "a") ((eq? 2 2) "b")';
        execAssert(test, 'a');
      },

      'cond with else 1' : function () {
        var test = '(cond (#f "should not happen") (else "test"))';
        execAssert(test, 'test');
      },

      'cond with else 2' : function () {
        var test = '(cond (#f "a") (#f "b") (#t "c") (else "test"))';
        execAssert(test, 'c');
      }

    },

    'test lambda expressions' : {

      'simple lambda' : function () {
        var test = '((lambda (n) (multiply n 10)) 3)';
        execAssert(test, 30);
      },

      'multiple argument lambda' : function () {
        var test = '((lambda (a b c) (plus a b c)) 1 2 3)';
        execAssert(test, 6);
      },

      'define lambda and call it' : function () {
        var test = '(define timesten (lambda (n) (multiply n 10)))';
        exec(test);
        execAssert('(timesten 5)', 50);
      }

    },

    'test closures' : {

      'simple closure' : function () {
        exec('(define multiplier 10)');
        execAssert('((lambda (x) (multiply x multiplier)) 10)', 100);
      },

      'simple closure' : function () {
        exec('(define multipair (cons 2 5))');
        execAssert('((lambda (x) (multiply (car multipair) (cdr multipair) x)) 10)', 100);
      }

    }

  }).export(module);
