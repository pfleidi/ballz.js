/*!
 * Native implementations of some Lisp functions
 */

var Assert = require('assert');

function genericReduce(args, reduceFunc) {
  Assert.ok(args.length >= 2, 'At least two arguments are needed. Given: ' + args.length);
  return args.reduce(function (prev, curr) {
      Assert.ok(typeof curr === "number", 'Argument + ' + curr + ' is not a number');
      return reduceFunc(prev, curr);
    });
}

function plus(args) {
  return genericReduce(args, function (prev, curr) {
      return prev + curr;
    });
}

function minus(args) {
  return genericReduce(args, function (prev, curr) {
      return prev - curr;
    });
}

function multiply(args) {
  return genericReduce(args, function (prev, curr) {
      return prev * curr;
    });
}

function divide(args) {
  return genericReduce(args, function (prev, curr) {
      return prev / curr;
    });
}

function equals(args) {
  Assert.ok(args.length === 2, 'Two arguments are needed. Given: ' + args.length);
  return args[0] === args[1];
}

function cons(first, second) {
  return [first, second];
}

function car(pair) {
  return pair[0];
}

function cdr(pair) {
  return pair[1];
}

module.exports = {
  '+': plus,
  '-': minus,
  '*': multiply,
  '/': divide,
  'eq?': equals,
  '#f': false,
  '#t': true,
  cons: cons,
  car: car,
  cdr: cdr
};
