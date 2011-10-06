var Assert = require('assert');
var Vows = require('vows');
var parser = require('../lib/parser');
var lisp = require('../lib/lisp');

function test(code) {
  Assert.strictEqual(lisp.inspect(parser.parse(code)), code);
}


Vows.describe('test lisp object inspector').addBatch({
    'test expression': function () {
      test('(cond (#f "a") (#f "b") (#t "c") (else "test"))');
    },

    'test other expression': function () {
      test('(foo a b (bar c d))');
    }
  }).export(module);
