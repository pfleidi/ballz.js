/*!
 * Unit tests for pre-defined Lisp functions
 *
 * @author pfleidi
 */

var Functions = require('../lib/native_functions');
var Assert = require('assert');


exports['test plus'] = function () {
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
};


exports['test minus'] = function () {
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
};

exports['test multiply'] = function () {
  var val1 = Functions['*']([1, 2, 3, 4, 5]);
  Assert.strictEqual(val1, 120);

  var val2 = Functions['*']([1, 2, 3, 4, -5]);
  Assert.strictEqual(val2, -120);
};

exports['test divide'] = function () {
  var val1 = Functions['/']([1, 2, 3, 4, 5]);
  Assert.strictEqual(val1, 0.008333333333333333);

  var val2 = Functions['/']([1, 2, 3, 4, -5]);
  Assert.strictEqual(val2, -0.008333333333333333);

  var val4 = Functions['/']([4, 0]);
  Assert.strictEqual(val4, Infinity);
};

exports['test equals'] = function () {
  var val1 = Functions['eq?']([1, 2]);
  Assert.strictEqual(val1, false);

  var val2 = Functions['eq?']([false, false]);
  Assert.strictEqual(val2, true);

  var val3 = Functions['eq?'](['doo', 'doo']);
  Assert.strictEqual(val3, true);
};

exports['test cons'] = function () {
  var val1 = Functions.cons(['a', 23]);
  Assert.deepEqual(val1, ['a', 23]);
};

exports['test car'] = function () {
  Assert.strictEqual(Functions.car([['a', 'b']]), 'a');
};

exports['test cdr'] = function () {
  Assert.strictEqual(Functions.cdr([['a', 'b']]), 'b');
};
