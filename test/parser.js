var Vows = require('vows');
var Assert = require('assert');
var Parser = require('../lib/parser');
var Scanner = require('../lib/scanner');
var Lisp = require('../lib/lisp');

var pair = Lisp.pair;
var number = Lisp.number;
var string = Lisp.string;
var symbol = Lisp.symbol;
var nil = Lisp.nil;

Vows.describe('evaluate simple instructions').addBatch({

    'parse primitive values': {

      'parse number': function () {
        Assert.deepEqual(Parser.parse('5'), number(5));
      },

      'parse symbol': function () {
        Assert.deepEqual(Parser.parse('asdf'), symbol('asdf'));
      },

      'parse string': function () {
        Assert.deepEqual(Parser.parse('"asdf"'), string('asdf'));
      },

      'parse nil': function () {
        Assert.deepEqual(Parser.parse('()'), nil());
      },

      'parse pair': function () {
        Assert.deepEqual(Parser.parse('(1 . 2)'), pair(number(1), number(2)));
      },

      'parse larger pair': function () {
        Assert.deepEqual(Parser.parse('(1 2 . 3)'),
          pair(
            number(1),
            pair(number(2), number(3) ) )
        );
      }

    },


    'test parse define' : function () {
      Assert.deepEqual(Parser.parse('(define x "asdf")'),
        pair(symbol('define'),
          pair(symbol('x'),
            pair(string('asdf'),
              nil() ) ) )
      );
    },


    'parse wrapped pairs' : function () {
      Assert.deepEqual(Parser.parse('(foo x (foo 5 asdf))'),
        pair(symbol('foo'),
          pair(symbol('x'),
            pair(
              pair(symbol('foo'),
                pair(number('5'),
                  pair(symbol('asdf'), nil() )
                ) ),
              nil() ) ) )
      );
    },

    'parse calculation' : function () {
      Assert.deepEqual(Parser.parse('(- (+ 10 2) 5)'),
        pair(symbol('-'),
          pair(
            pair(symbol('+'),
              pair(number('10'),
                pair(number('2'), nil() ) ) ),
            pair(number('5'), nil() ) ) )
      );
    }

  }).export(module);

