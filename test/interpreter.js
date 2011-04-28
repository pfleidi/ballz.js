/*!
 * Interpreter unit test
 */

var Assert = require('assert');
var Environment = require('../lib/environment');
var interpreter = require('../lib/interpreter').createInterpreter(
  Environment.createEnvironment()
);

exports['eval number expressions'] = function () {

  var number1 = interpreter.eval({
      type: 'NUMBER', value: '23.42'
    });

  Assert.strictEqual(number1, 23.42);

  var number2 = interpreter.eval({
      type: 'NUMBER', value: '12345'
    });

  Assert.strictEqual(number2, 12345);
};

exports['eval string expressions'] = function () {
  var env = Environment.createEnvironment();
  env.put('str', 'ASDF! fsklj;la');

  var str1 = interpreter.eval({
      type: 'STRING', value: 'Hurr Durr Derp!'
    });

  Assert.strictEqual(str1, 'Hurr Durr Derp!');

  var number2 = interpreter.eval({
      type: 'NUMBER', value: '12345'
    }, env);

  var str2 =  interpreter.eval({
      type: 'SYMBOL', value: 'str'
    }, env);

  Assert.strictEqual(str2, 'ASDF! fsklj;la');
};

exports['eval sequence'] = function () {
  var env = Environment.createEnvironment();
  env.put('someVal', 1340);

  // (+ 10 32) == 42
  var val1 = interpreter.eval({
      type: 'PAIR',
      value: [
        { type: 'SYMBOL', value: '+' },
        { type: 'NUMBER', value: '10' },
        { type: 'NUMBER', value: '32' }
      ]
    }, env);

  Assert.strictEqual(val1, 42);

  // (- someVal 3)
  var val2 = interpreter.eval({
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
  var val1 = interpreter.eval({
      type: 'PAIR',
      value: [
        { type: 'SYMBOL', value: 'define' },
        { type: 'SYMBOL', value: 'someVal' },
        { type: 'NUMBER', value: '3' }
      ]
    });
  Assert.strictEqual(val1, 3);

  var val2 = interpreter.eval({
      type: 'SYMBOL', value: 'someVal'
    });

  Assert.strictEqual(val2, 3);
};

exports['eval cons'] = function () {

  // (define foo (cons 'asdf' 3))
  var val1 = interpreter.eval({
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
    });

  Assert.deepEqual(val1, ['asdf', 3]);

  var val2 = interpreter.eval({
      type: 'SYMBOL', value: 'foo'
    });

  Assert.deepEqual(val2, ['asdf', 3]);

  // (car (cons 'asdf' 3))
  var val3 = interpreter.eval({
      type: 'PAIR',
      value: [
        { type: 'SYMBOL', value: 'car' },
        { type: 'SYMBOL', value: 'foo' }
      ]
    });

  Assert.strictEqual(val3, 'asdf');
};

exports['eval cdr'] = function () {
  // (cdr (cons 'asdf' 3))
  var val1 = interpreter.eval({
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
