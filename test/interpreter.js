/*!
 * Interpreter unit test
 */

var Assert = require('assert');
var Environment = require('../lib/environment');
var Interpreter = require('../lib/interpreter');

exports['eval number expressions'] = function () {

  var number1 = Interpreter.myEval({
      type: 'NUMBER',
      value: '23.42'
    });

  Assert.strictEqual(number1, 23.42);

  var number2 = Interpreter.myEval({
      type: 'NUMBER',
      value: '12345'
    });

  Assert.strictEqual(number2, 12345);
};

exports['eval string expressions'] = function () {
  var env = Environment.createEnvironment();
  env.put('str', 'ASDF! fsklj;la');

  var str1 = Interpreter.myEval({
      type: 'STRING',
      value: 'Hurr Durr Derp!'
    });

  Assert.strictEqual(str1, 'Hurr Durr Derp!');

  var number2 = Interpreter.myEval({
      type: 'NUMBER',
      value: '12345'
    }, env);

  var str2 =  Interpreter.myEval({
      type: 'SYMBOL',
      value: 'str'
    }, env);

  Assert.strictEqual(str2, 'ASDF! fsklj;la');
};

exports['test myEval environment'] = function () {
  var env = Environment.createEnvironment();
  env.put('a', 123);
  env.put('b', 234);

  var val1 =  Interpreter.myEval({
      type: 'SYMBOL',
      value: 'a'
    }, env);

  Assert.strictEqual(val1, 123);

  var val2 =  Interpreter.myEval({
      type: 'SYMBOL',
      value: 'b'
    }, env);

  Assert.strictEqual(val2, 234);
};

// (+ 10 32) == 42
exports['eval sequence'] = function () {
  var env = Environment.createEnvironment();
  env.put('someVal', 1340);

  var val1 = Interpreter.myEval({
      type: 'PAIR',
      value: [
        { type: 'SYMBOL', value: '+' },
        { type: 'NUMBER', value: '10' },
        { type: 'NUMBER', value: '32' }
      ]
    }, env);

  Assert.strictEqual(val1, 42);

  var val2 = Interpreter.myEval({
      type: 'PAIR',
      value: [
        { type: 'SYMBOL', value: '-' },
        { type: 'SYMBOL', value: 'someVal' },
        { type: 'NUMBER', value: '3' }
      ]
    }, env);

  Assert.strictEqual(val2, 1337);
};

exports['eval define'] = function () {
  var env = Environment.createEnvironment();
  var val1 = Interpreter.myEval({
      type: 'PAIR',
      value: [
        { type: 'SYMBOL', value: 'define' },
        { type: 'SYMBOL', value: 'someVal' },
        { type: 'NUMBER', value: '3' }
      ]
    }, env);
  Assert.strictEqual(val1, 3);

  var val2 = Interpreter.myEval({
      type: 'SYMBOL',
      value: 'someVal'
    }, env);

  Assert.strictEqual(val2, 3);
};

exports['eval cons'] = function () {
  var env = Environment.createEnvironment();
  // (define foo (cons 'asdf' 3))
  var val1 = Interpreter.myEval({
      type: 'PAIR',
      value: [
        { type: 'SYMBOL', value: 'define' },
        { type: 'SYMBOL', value: 'foo' },
        { type: 'PAIR',
          value: [
            { type: 'SYMBOL', value: 'cons' },
            { type: 'STRING', value: 'asdf' },
            { type: 'NUMBER', value: '3' }
          ]
        }
      ]
    }, env);

  Assert.deepEqual(val1, ['asdf', 3]);

  var val2 = Interpreter.myEval({
      type: 'SYMBOL',
      value: 'foo'
    }, env);

  Assert.deepEqual(val2, ['asdf', 3]);

};

exports['eval car'] = function () {
  // (car (cons 'asdf' 3))
  var val1 = Interpreter.myEval({
      type: 'PAIR',
      value: [
        { type: 'SYMBOL', value: 'car' },
        { type: 'PAIR',
          value: [
            { type: 'SYMBOL', value: 'cons' },
            { type: 'STRING', value: 'asdf' },
            { type: 'NUMBER', value: '3' }
          ]
        }
      ]
    });

  Assert.strictEqual(val1, 'asdf');
};

exports['eval cdr'] = function () {
  // (cdr (cons 'asdf' 3))
  var val1 = Interpreter.myEval({
      type: 'PAIR',
      value: [
        { type: 'SYMBOL', value: 'cdr' },
        { type: 'PAIR',
          value: [
            { type: 'SYMBOL', value: 'cons' },
            { type: 'STRING', value: 'asdf' },
            { type: 'NUMBER', value: '3' }
          ]
        }
      ]
    });

  Assert.strictEqual(val1, 3);
};
