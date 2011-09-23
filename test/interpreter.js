/*!
 * Interpreter unit test
 */

var Vows = require('vows');
var Assert = require('assert');
var Environment = require('../lib/environment');
var interpreter = require('../lib/interpreter').createInterpreter(
  Environment.createEnvironment()
);

Vows.describe('evaluate simple instructions').addBatch({

    'eval number expressions' : function () {

      var number1 = interpreter.eval({
          type: 'NUMBER', value: '23.42'
        });

      Assert.strictEqual(number1, 23.42);

      var number2 = interpreter.eval({
          type: 'NUMBER', value: '12345'
        });

      Assert.strictEqual(number2, 12345);
    },

    'eval boolean expressions' : function () {
      var env = Environment.createEnvironment();
      var bool1 = interpreter.eval({ type: 'SYMBOL', value: '#t' });
      Assert.strictEqual(bool1, true);

      var bool2 = interpreter.eval({ type: 'SYMBOL', value: '#f' });
      Assert.strictEqual(bool2, false);
    },

    'eval string expressions' : function () {
      var env = Environment.createEnvironment();
      env.put('str', 'ASDF! fsklj;la');

      var str1 = interpreter.eval({
          type: 'STRING', value: 'Hurr Durr Derp!'
        });

      Assert.strictEqual(str1, 'Hurr Durr Derp!');

      var number2 = interpreter.eval({
          type: 'NUMBER', value: '12345'
        }, env);

      var str2 =  interpreter.eval({
          type: 'SYMBOL', value: 'str'
        }, env);

      Assert.strictEqual(str2, 'ASDF! fsklj;la');
    },

    'eval sequence' : function () {
      var env = Environment.createEnvironment();
      env.put('someVal', 1340);

      // (+ 10 32) == 42
      var val1 = interpreter.eval({
          type: 'PAIR',
          value:
          [
            { type: 'SYMBOL', value: '+' },
            { type: 'NUMBER', value: '10' },
            { type: 'NUMBER', value: '32' } ] }, env);

      Assert.strictEqual(val1, 42);

      // (- someVal 3)
      var val2 = interpreter.eval({
          type: 'PAIR',
          value:
          [ { type: 'SYMBOL', value: '-' },
            { type: 'SYMBOL', value: 'someVal' },
            { type: 'NUMBER', value: '3' } ] }, env);

      Assert.strictEqual(val2, 1337);

      var val3 = interpreter.eval({ type: 'PAIR',
          value:
          [ { type: 'SYMBOL', value: '+' },
            { type: 'NUMBER', value: '3' },
            { type: 'NUMBER', value: '2' } ] }, env);

      Assert.strictEqual(val3, 5);
    },

    'eval define' : function () {
      var val1 = interpreter.eval({
          type: 'PAIR',
          value: [
            { type: 'SYMBOL', value: 'define' },
            { type: 'SYMBOL', value: 'someVal' },
            { type: 'NUMBER', value: '3' }
          ]
        });
      Assert.strictEqual(val1, 3);

      var val2 = interpreter.eval({
          type: 'SYMBOL', value: 'someVal'
        });

      Assert.strictEqual(val2, 3);
    },

    'eval cons' : function () {

      // (define foo (cons 'asdf' 3))
      var val1 = interpreter.eval({
          type: 'PAIR',
          value: [
            { type: 'SYMBOL', value: 'define' },
            { type: 'SYMBOL', value: 'foo' },
            { type: 'PAIR',
              value: [
                { type: 'SYMBOL', value: 'cons' },
                { type: 'STRING', value: 'asdf' },
                { type: 'NUMBER', value: '3' }
              ]
            }
          ]
        });

      Assert.deepEqual(val1, ['asdf', 3]);

      var val2 = interpreter.eval({
          type: 'SYMBOL', value: 'foo'
        });

      Assert.deepEqual(val2, ['asdf', 3]);

      // (car (cons 'asdf' 3))
      var val3 = interpreter.eval({
          type: 'PAIR',
          value:
          [
            { type: 'SYMBOL', value: 'car' },
            { type: 'SYMBOL', value: 'foo' } ] }
      );

      Assert.strictEqual(val3, 'asdf');
    },

    'eval cdr' : function () {
      // (cdr (cons 'asdf' 3))
      var val1 = interpreter.eval({
          type: 'PAIR',
          value: [
            { type: 'SYMBOL', value: 'cdr' },
            { type: 'PAIR',
              value: [
                { type: 'SYMBOL', value: 'cons' },
                { type: 'STRING', value: 'asdf' },
                { type: 'NUMBER', value: '3' }
              ]
            }
          ]
        });

      Assert.strictEqual(val1, 3);
    },

    'eval if' : function () {
      // (if (eq? 1 1) #t #f)
      var val = interpreter.eval({
          type: 'PAIR',
          value: [
            { type: 'SYMBOL', value: 'if' },
            { type: 'PAIR',
              value: [
                { type: 'SYMBOL', value: 'eq?' },
                { type: 'NUMBER', value: '1' },
                { type: 'NUMBER', value: '1' }
              ] },
            { type: 'SYMBOL', value: '#t' },
            { type: 'SYMBOL', value: '#f' }
          ]
        });

      Assert.strictEqual(val, true);
    },

    'eval cond without else' : function () {
      // (cond ((eq? 1 2) #f) ((eq? 2 2) #t)
      var val = interpreter.eval({
          type: 'PAIR',
          value: [
            { type: 'SYMBOL', value: 'cond' },
            { type: 'PAIR',
              value: [
                { type: 'PAIR',
                  value: [
                    { type: 'SYMBOL', value: 'eq?' },
                    { type: 'NUMBER', value: '1' },
                    { type: 'NUMBER', value: '2' }
                  ]
                },
                { type: 'SYMBOL', value: '#f' }
              ]
            },
            { type: 'PAIR',
              value: [
                { type: 'PAIR',
                  value: [
                    { type: 'SYMBOL', value: 'eq?' },
                    { type: 'NUMBER', value: '2' },
                    { type: 'NUMBER', value: '2' }
                  ]
                },
                { type: 'SYMBOL', value: '#t' }
              ]
            }
          ]
        }
      );
      Assert.strictEqual(val, true);
    },

    'eval cond with else' : function () {
      // (cond ((eq? 1 2) #f) ((eq? 2 2) #t))
      var val = interpreter.eval({
          type: 'PAIR',
          value: [
            { type: 'SYMBOL', value: 'cond' },
            { type: 'PAIR',
              value: [
                { type: 'SYMBOL', value: 'else'},
                { type: 'STRING', value: 'foo' }
              ]
            }
          ]
        });

      Assert.strictEqual(val, 'foo');
    },

    'eval lambda statements' : {
      '((lambda (n) (* n 10)) 3)' : function () {
        var val = interpreter.eval({
            type : "PAIR",
            value : [ {
                type : "PAIR", value : [
                  { type : "SYMBOL", value : "lambda" },
                  { type : "PAIR",
                    value: [ { type : "SYMBOL", value : "n" } ]
                  },
                  {
                    type: "PAIR",
                    value: [
                      { type : "SYMBOL", value : "*" },
                      { type : "SYMBOL", value : "n" },
                      { type : "NUMBER", value : "10" }
                    ] }
                ] },
              { type : "NUMBER", value : "3" }
            ] });

        Assert.strictEqual(val, 30);
      }
    }


  }).export(module);
