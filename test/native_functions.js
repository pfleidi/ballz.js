/*!
 * Unit tests for pre-defined Lisp functions
 *
 * @author pfleidi
 */

var Vows = require('vows');
var Lisp = require('../lib/lisp');
var Assert = require('assert');

var cons = Lisp.cons;
var nil = Lisp.nil;

Vows.describe('evaluate simple instructions').addBatch({

    'test plus' : function () {
      var val1 = Lisp.plus(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val1, 15);

      var val2 = Lisp.plus(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(-5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val2, 5);

      Assert.throws(
        function () {
          var val4 = Lisp.plus(cons(1, cons('hurr', nil())));
        },
        /is not a number/
      );
    }, 

    'test minus' : function () {
      var val1 = Lisp.minus(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val1, -13);

      var val2 = Lisp.minus(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(-5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val2, -3);
    },

    'test multiply' : function () {
      var val1 = Lisp.multiply(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val1, 120);

      var val2 = Lisp.multiply(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(-5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val2, -120);
    },

    'test divide' : function () {
      var val1 = Lisp.divide(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val1, 0.008333333333333333);

      var val2 = Lisp.divide(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(-5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val2, -0.008333333333333333);

      var val4 = Lisp.divide(cons(4, cons(0, nil())));
      Assert.strictEqual(val4, Infinity);
    },

    'test equals' : function () {
      var val1 = Lisp['equals'](cons(1, cons(2, nil())));
      Assert.strictEqual(val1, false);

      var val2 = Lisp['equals'](cons(false, cons(false, nil())));
      Assert.strictEqual(val2, true);

      var val3 = Lisp['equals'](cons('lala', cons('lala', nil())));
      Assert.strictEqual(val3, true);
    },

    'test not': function () {
      var val1 = Lisp['not'](cons(true, nil()));
      Assert.strictEqual(val1, false);

      var val2 = Lisp['not'](cons(false, nil()));
      Assert.strictEqual(val2, true);
    },

    'test or': function () {
      var val1 = Lisp['or'](
        cons(false, cons(false, cons(false, nil())))
      )
      Assert.strictEqual(val1, false);

      var val2 = Lisp['or'](
        cons(true, cons(true, cons(true, nil())))
      )
      Assert.strictEqual(val2, true);

      var val3 = Lisp['or'](
        cons(true, cons(true, cons(false, nil())))
      )
      Assert.strictEqual(val3, true);

      var val4 = Lisp['or'](
        cons(false, cons(true, cons(false, nil())))
      )
      Assert.strictEqual(val4, true);

      var val5 = Lisp['or'](
        cons(false, cons(false, cons(true, nil())))
      )
      Assert.strictEqual(val5, true);
    },

    'test and': function () {
      var val1 = Lisp['and'](cons(true, cons(true, nil())));
      Assert.strictEqual(val1, true);

      var val2 = Lisp['and'](cons(false, cons(true, nil())));
      Assert.strictEqual(val2, false);

      var val3 = Lisp['and'](cons(true, cons(false, nil())));
      Assert.strictEqual(val3, false);

      var val4 = Lisp['and'](cons(false, cons(false, nil())));
      Assert.strictEqual(val4, false);
    },

    'test xor': function () {
      var val1 = Lisp['xor'](cons(true, cons(true, nil())));
      Assert.strictEqual(val1, false);

      var val2 = Lisp['xor'](cons(false, cons(true, nil())));
      Assert.strictEqual(val2, true);

      var val3 = Lisp['xor'](cons(true, cons(false, nil())));
      Assert.strictEqual(val3, true);

      var val4 = Lisp['xor'](cons(false, cons(false, nil())));
      Assert.strictEqual(val4, false);
    }

  }).export(module);
