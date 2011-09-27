/*!
 * Unit tests for pre-defined Functions functions
 *
 * @author pfleidi
 */

var Vows = require('vows');
var Assert = require('assert');

var Functions = require('../lib/native_functions');
var Lisp = require('../lib/lisp');

var cons = Lisp.cons;
var nil = Lisp.nil;

Vows.describe('evaluate simple instructions').addBatch({

    'test plus' : function () {
      var val1 = Functions.plus(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val1, 15);

      var val2 = Functions.plus(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(-5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val2, 5);

      Assert.throws(
        function () {
          var val4 = Functions.plus(cons(1, cons('hurr', nil())));
        },
        /is not a number/
      );
    }, 

    'test minus' : function () {
      var val1 = Functions.minus(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val1, -13);

      var val2 = Functions.minus(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(-5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val2, -3);
    },

    'test multiply' : function () {
      var val1 = Functions.multiply(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val1, 120);

      var val2 = Functions.multiply(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(-5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val2, -120);
    },

    'test divide' : function () {
      var val1 = Functions.divide(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val1, 0.008333333333333333);

      var val2 = Functions.divide(
        cons(1, cons(2, 
            cons(3, cons(4,
                cons(-5, nil() ) ) ) ) )
      );
      Assert.strictEqual(val2, -0.008333333333333333);

      var val4 = Functions.divide(cons(4, cons(0, nil())));
      Assert.strictEqual(val4, Infinity);
    },

    'test equals' : function () {
      var val1 = Functions['equals'](cons(1, cons(2, nil())));
      Assert.strictEqual(val1, false);

      var val2 = Functions['equals'](cons(false, cons(false, nil())));
      Assert.strictEqual(val2, true);

      var val3 = Functions['equals'](cons('lala', cons('lala', nil())));
      Assert.strictEqual(val3, true);
    },

    'test not': function () {
      var val1 = Functions['not'](cons(true, nil()));
      Assert.strictEqual(val1, false);

      var val2 = Functions['not'](cons(false, nil()));
      Assert.strictEqual(val2, true);
    },

    'test or': function () {
      var val1 = Functions['or'](
        cons(false, cons(false, cons(false, nil())))
      )
      Assert.strictEqual(val1, false);

      var val2 = Functions['or'](
        cons(true, cons(true, cons(true, nil())))
      )
      Assert.strictEqual(val2, true);

      var val3 = Functions['or'](
        cons(true, cons(true, cons(false, nil())))
      )
      Assert.strictEqual(val3, true);

      var val4 = Functions['or'](
        cons(false, cons(true, cons(false, nil())))
      )
      Assert.strictEqual(val4, true);

      var val5 = Functions['or'](
        cons(false, cons(false, cons(true, nil())))
      )
      Assert.strictEqual(val5, true);
    },

    'test and': function () {
      var val1 = Functions['and'](cons(true, cons(true, nil())));
      Assert.strictEqual(val1, true);

      var val2 = Functions['and'](cons(false, cons(true, nil())));
      Assert.strictEqual(val2, false);

      var val3 = Functions['and'](cons(true, cons(false, nil())));
      Assert.strictEqual(val3, false);

      var val4 = Functions['and'](cons(false, cons(false, nil())));
      Assert.strictEqual(val4, false);
    },

    'test xor': function () {
      var val1 = Functions['xor'](cons(true, cons(true, nil())));
      Assert.strictEqual(val1, false);

      var val2 = Functions['xor'](cons(false, cons(true, nil())));
      Assert.strictEqual(val2, true);

      var val3 = Functions['xor'](cons(true, cons(false, nil())));
      Assert.strictEqual(val3, true);

      var val4 = Functions['xor'](cons(false, cons(false, nil())));
      Assert.strictEqual(val4, false);
    }

  }).export(module);
