/*!
 * lisp.js
 *
 * LISP data types and helpers
 */

var Assert = require('assert');

var nil = exports.nil = function nil() {
  return { type: 'NULL' };
};

var pair = exports.pair = function pair(left, right) {
  Assert.ok(left, 'pair: left argument needed!');
  Assert.ok(right, 'pair: right argument needed!');

  if (left.type === 'NULL' && right.type === 'NULL') {
    return nil();
  }
  return {
    type: 'PAIR',
    left: left,
    right: right
  };
};

var cons = exports.cons = function cons(left, right) {
  return pair(left, right);
};

var car = exports.car = function car(pair) {
  return pair.left;
};

var cdr = exports.cdr = function cdr(pair) {
  return pair.right;
};

var map = exports.map = function map(pair, func) {

  if (pair.type === 'NULL') {
    return nil();
  }

  return cons(func(car(pair)), map(cdr(pair), func));
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
