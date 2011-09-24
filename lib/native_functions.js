/*!
 * Native implementations of some Lisp functions
 */

var Assert = require('assert');

function genericReduce(args, reduceFunc, assertion) {
  Assert.ok(args.length >= 2, 'At least two arguments are needed. Given: ' + args.length);
  return args.reduce(function (prev, curr) {
      if (assertion) {
        assertion(curr);
      }
      return reduceFunc(prev, curr);
    });
}

function ensureNumber(curr) {
  Assert.ok(typeof curr === "number", 'Argument + ' + curr + ' is not a number');
}

function plus(args) {
  return genericReduce(args, function (prev, curr) {
      return prev + curr;
    }, ensureNumber);
}

function minus(args) {
  return genericReduce(args, function (prev, curr) {
      return prev - curr;
    }, ensureNumber);
}

function multiply(args) {
  return genericReduce(args, function (prev, curr) {
      return prev * curr;
    }, ensureNumber);
}

function divide(args) {
  return genericReduce(args, function (prev, curr) {
      return prev / curr;
    }, ensureNumber);
}

function equals(args) {
  Assert.ok(args.length === 2, 'equal: Two arguments are needed. Given: ' + args.length);
  return args[0] === args[1];
}

function cons(args) {
  Assert.ok(args.length === 2, 'cons: Two arguments are needed. Given: ' + args.length);
  return [args[0], args[1]];
}

function car(args) {
  var pair = args[0];
  Assert.ok(pair, 'car: An argument is needed.');
  return pair[0];
}

function cdr(args) {
  var pair = args[0];
  Assert.ok(pair, 'cdr: An argument is needed.');
  return pair[1];
}

function not(args) {
  Assert.strictEqual(args.length, 1, 'not: One argument needed. Given: ' + args.length);
  return !args[0];
}

function or(args) {
  Assert.ok(args.length >= 1, 'or: At least one argument needed. Given: ' + args.length);

  return genericReduce(args, function (prev, curr) {
      return prev || curr;
    });
}

function and(args) {
  Assert.ok(args.length >= 1, 'or: At least one argument needed. Given: ' + args.length);

  return genericReduce(args, function (prev, curr) {
      return prev && curr;
    });
}

function xor(args) {
  Assert.ok(args.length === 2, 'cons: Two arguments are needed. Given: ' + args.length);

  return (args[0] || args[1]) && !(args[0] && args[1]);
}

function assert(args) {
  Assert.ok(args.length === 2, 'assert: Two arguments are needed. Given: ' + args.length);
  var expected = args[0];
  var actual = args[1];

  if (actual !== expected) {
    throw new Error('Assertion Error: exprected: ' + expected + ' actual: ' + actual);
  }
}

module.exports = {
  plus: plus,
  minus: minus,
  multiply: multiply,
  divide: divide,
  'eq?': equals,
  '#f': false,
  '#t': true,
  cons: cons,
  car: car,
  cdr: cdr,
  not: not,
  or: or,
  and: and,
  xor: xor,
  assert: assert
};
