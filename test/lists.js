/*
 * List structure unit tests
 */

var Assert = require('assert');
var Environment = require('../lib/environment');
var interpreter = require('../lib/interpreter').createInterpreter(
  Environment.createEnvironment()
);

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
};

exports['eval car'] = function () {

  // (car (cons 'asdf' 3))
  var val1 = interpreter.eval({
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
