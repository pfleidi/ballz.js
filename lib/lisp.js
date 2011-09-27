/*!
 * lisp.js
 *
 * LISP data types and helpers
 */

var Assert = require('assert');
var inspect = require('eyes').inspect;

var nil = exports.nil = function nil() {
  return { type: 'NULL' };
};

var cons = exports.cons = function conconss(left, right) {
  Assert.ok(typeof left !== 'undefined', 'cons(): left argument needed!');
  Assert.ok(typeof right !== 'undefined', 'cons(): right argument needed!');

  if (left.type === 'NULL' && right.type === 'NULL') {
    return nil();
  }
  return {
    type: 'PAIR',
    left: left,
    right: right
  };
};

var isPair = exports.isPair = function isPair(pair) {
  Assert.ok(typeof pair !== 'undefined', 'isPair(): An argument is needed.');
  return pair.type === 'PAIR';
}

var car = exports.car = function car(pair) {
  Assert.ok(pair, 'car: An argument is needed.');
  return pair.left;
};

var cdr = exports.cdr = function cdr(pair) {
  Assert.ok(pair, 'cdr: An argument is needed.');
  return pair.right;
};

var length = exports.length = function length(pair, len) {
  len = len || 0;
  if (!isPair(pair)) {
    return len;
  }
  return length(cdr(pair), len + 1);
};

var map = exports.map = function map(pair, func) {
  if (!isPair(pair)) {
    return nil();
  }
  return cons(func(car(pair)), map(cdr(pair), func));
};

var reduce = exports.reduce = function reduce(pair, func, initValue) {

  if (!isPair(pair)) {
    return initValue;
  }

  if (typeof initValue === 'undefined') {
    return reduce(cdr(pair), func, car(pair));
  }

  return reduce(cdr(pair), func, func(initValue, car(pair)));
};

var number = exports.number = function number(value) {
  return {
    type: 'NUMBER',
    value: Number(value)
  };
};

var isNumber = exports.isNumber = function isNumber(val) {
  return val.type === 'NUMBER';
};

var string = exports.string = function string(value) {
  return {
    type: 'STRING',
    value: String(value)
  };
};

var isString = exports.isString = function isString(val) {
  return val.type === 'STRING';
};

var symbol = exports.symbol = function symbol(value) {
  return {
    type: 'SYMBOL',
    value: value
  };
};

var isSymbol = exports.isSymbol = function isSymbol(val) {
  return val.type === 'SYMBOL';
};

var lambda = exports.lambda = function lambda(body, argList) {
  return {
    type: 'LAMBDA',
    body: body,
    args: argList
  };
};

var isLambda = exports.isLambda = function isLambda(val) {
  return val.type === 'LAMBDA';
};

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
  var expected = args[0];
  var actual = args[1];

  if (actual !== expected) {
    throw new Error('Assertion Error: exprected: ' + expected + ' actual: ' + actual);
  }
};
