/*!
 * Unit tests for pre-defined Lisp functions
 *
 * @author pfleidi
 */

var Vows = require('vows');
var Functions = require('../lib/native_functions');
var Assert = require('assert');

Vows.describe('evaluate simple instructions').addBatch({

    'test plus' : function () {
      var val1 = Functions['+']([1, 2, 3, 4, 5]);
      Assert.strictEqual(val1, 15);

      var val2 = Functions['+']([1, 2, 3, 4, -5]);
      Assert.strictEqual(val2, 5);

      Assert.throws(
        function () {
          var val3 = Functions['+']([]);
        },
        /At least two arguments are needed./
      );

      Assert.throws(
        function () {
          var val4 = Functions['+']([1, 'hurr']);
        },
        /is not a number/
      );
    }, 

    'test minus' : function () {
      var val1 = Functions['-']([1, 2, 3, 4, 5]);
      Assert.strictEqual(val1, -13);

      var val2 = Functions['-']([1, 2, 3, 4, -5]);
      Assert.strictEqual(val2, -3);

      Assert.throws(
        function () {
          var val3 = Functions['-']([]);
        },
        /At least two arguments are needed./
      );
    },

    'test multiply' : function () {
      var val1 = Functions['*']([1, 2, 3, 4, 5]);
      Assert.strictEqual(val1, 120);

      var val2 = Functions['*']([1, 2, 3, 4, -5]);
      Assert.strictEqual(val2, -120);
    },

    'test divide' : function () {
      var val1 = Functions['/']([1, 2, 3, 4, 5]);
      Assert.strictEqual(val1, 0.008333333333333333);

      var val2 = Functions['/']([1, 2, 3, 4, -5]);
      Assert.strictEqual(val2, -0.008333333333333333);

      var val4 = Functions['/']([4, 0]);
      Assert.strictEqual(val4, Infinity);
    },

    'test equals' : function () {
      var val1 = Functions['eq?']([1, 2]);
      Assert.strictEqual(val1, false);

      var val2 = Functions['eq?']([false, false]);
      Assert.strictEqual(val2, true);

      var val3 = Functions['eq?'](['doo', 'doo']);
      Assert.strictEqual(val3, true);
    },

    'test cons' : function () {
      var val1 = Functions.cons(['a', 23]);
      Assert.deepEqual(val1, ['a', 23]);
    },

    'test car' : function () {
      Assert.strictEqual(Functions.car([['a', 'b']]), 'a');
    },

    'test cdr' : function () {
      Assert.strictEqual(Functions.cdr([['a', 'b']]), 'b');
    }

  }).export(module);
