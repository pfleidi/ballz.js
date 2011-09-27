/*!
 * test lisp module
 */

var Assert = require('assert');
var Vows = require('vows');
var Lisp = require('../lib/lisp');

Vows.describe('Test lisp helpers').addBatch({

    'test AST helpers' : {

      'nil()' : function () {
        Assert.deepEqual(Lisp.nil(), {
            type: 'NULL'
          });
      },

      'cons()' : function () {
        Assert.deepEqual(Lisp.cons(2, 3), {
            type: 'PAIR',
            left: 2,
            right: 3
          });
      },

      'number' : function () {
        Assert.deepEqual(Lisp.number('5'), {
            type: 'NUMBER',
            value: 5
          });
      },

      'string' : function () {
        Assert.deepEqual(Lisp.string('hello world'), {
            type: 'STRING',
            value: 'hello world'
          });
      },

      'symbol' : function () {
        Assert.deepEqual(Lisp.symbol('test'), {
            type: 'SYMBOL',
            value: 'test'
          });
      },

      'lambda' : function () {
        Assert.deepEqual(Lisp.lambda('body', 'arglist'), {
            type: 'LAMBDA',
            body: 'body',
            args: 'arglist'
          });
      }

    },

    'test helper functions' : {

      'car()' : function () {
        Assert.strictEqual(Lisp.car(Lisp.cons('a', 'b')), 'a');
      },

      'cdr()' : function () {
        Assert.strictEqual(Lisp.cdr(Lisp.cons('a', 'b')), 'b');
      },

      'map()' : function () {
        var cons = Lisp.cons;

        var val = cons(1,
          cons(2, cons(3,
              cons(4, cons(5, Lisp.nil() ) ) ) ) );

        var expected = cons(1,
          cons(4, cons(9,
              cons(16, cons(25, Lisp.nil() ) ) ) ) );

        Assert.deepEqual(Lisp.map(val, function (el) {
              return el * el;
            }), expected);
      },

      'reduce()' : function () {
        var cons = Lisp.cons;

        var val = cons(1,
          cons(2, cons(3,
              cons(4, cons(5, Lisp.nil() ) ) ) ) );

        Assert.deepEqual(Lisp.reduce(val, function (acc, curr) {
              return acc + curr;
            }), 15);

       var val2 = cons(1,
          cons(2, cons(3,
              cons(4, cons(5, Lisp.nil() ) ) ) ) );

        Assert.deepEqual(Lisp.reduce(val2, function (acc, curr) {
              return acc - curr;
            }), -13);

      },

      'length()' : function () {
        var cons = Lisp.cons;
        var val = cons(1,
          cons(2, cons(3,
              cons(4, cons(5, Lisp.nil() ) ) ) ) );
        Assert.strictEqual(Lisp.length(val), 5);
      }

    }
  }).export(module);
