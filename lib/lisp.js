/*!
 * lisp.js
 *
 * LISP data types and helpers
 */

var Assert = require('assert');
var Eyes = require('eyes');

var nil = exports.nil = function nil() {
  return { type: 'NULL' };
};

var isNil = exports.isNil = function isNil(val) {
  return val.type === 'NULL';
};

var cons = exports.cons = function cons(left, right) {
  if (!right) {
    Eyes.inspect(left);
  }
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
};

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


var inspect = exports.inspect = function inspect(pair) {

  function value(val) {
    if (isPair(val)) {
      return inspect(val);
    } else if (isString(val)) {
      return '"' + val.value + '"';
    }
    return val.value;
  }

  function traverse(pair, str) {
    if (!isPair(pair)) {
      return str;
    }
    if (str.length > 0) {
      str = str + ' ';
    }
    return traverse(cdr(pair), str + value(car(pair)));
  }

  return '(' + traverse(pair, '') + ')';
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

var lambda = exports.lambda = function lambda(body, argsList) {
  return {
    type: 'LAMBDA',
    args: argsList,
    body: body
  };
};

var quote = exports.quote = function quote(value) {
  return {
    type: 'QUOTE',
    value: value
  };
};

var isQuote = exports.isQuote = function isQuote(val) {
  return val.type === 'QUOTE';
};
