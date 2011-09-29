/*!
 * native JS functions bound to the ballz environment
 */

var Assert = require('assert');
var Lisp = require('./lisp');

var cons = Lisp.cons;
var car = Lisp.car;
var cdr = Lisp.cdr;
var length = Lisp.length;
var reduce = Lisp.reduce;

function genericReduce(args, reduceFunc, assertion) {
  return reduce(args, function (prev, curr) {
      if (assertion) {
        assertion(curr);
      }
      return reduceFunc(prev, curr);
    });
}

function ensureNumber(curr) {
  Assert.ok(typeof curr === "number", 'Argument + ' + curr + ' is not a number');
}

exports.plus = function plus(args) {
  return genericReduce(args, function (prev, curr) {
      return prev + curr;
    }, ensureNumber);
};

exports.minus = function minus(args) {
  return genericReduce(args, function (prev, curr) {
      return prev - curr;
    }, ensureNumber);
};

exports.multiply = function multiply(args) {
  return genericReduce(args, function (prev, curr) {
      return prev * curr;
    }, ensureNumber);
};

exports.divide = function divide(args) {
  return genericReduce(args, function (prev, curr) {
      return prev / curr;
    }, ensureNumber);
};

exports.equals = function equals(args) {
  Assert.strictEqual(length(args), 2, 'equal(): Two arguments are needed. Given: ' + length(args));
  return car(args) === car(cdr(args));
};

exports.not = function not(args) {
  Assert.strictEqual(length(args), 1, 'not: One argument needed. Given: ' + length(args));
  return !car(args);
};

exports.or = function or(args) {
  Assert.ok(length(args) >= 1, 'or: At least one argument needed. Given: ' + length(args));

  return genericReduce(args, function (prev, curr) {
      return prev || curr;
    });
};

exports.and = function and(args) {
  Assert.ok(length(args) >= 1, 'or: At least one argument needed. Given: ' + length(args));

  return genericReduce(args, function (prev, curr) {
      return prev && curr;
    });
};

exports.xor = function xor(args) {
  Assert.strictEqual(length(args), 2, 'cons: Two arguments are needed. Given: ' + length(args));

  return (car(args) || car(cdr(args))) && !(car(args) && car(cdr(args)));
};

exports.assert = function assert(args) {
  Assert.strictEqual(length(args), 2, 'assert: Two arguments are needed. Given: ' + length(args));
  var expected = args[0],
      actual = args[1];

  if (actual !== expected) {
    throw new Error('Assertion Error: exprected: ' + expected + ' actual: ' + actual);
  }
};

exports['#t'] = true;
exports['#f'] = false;
