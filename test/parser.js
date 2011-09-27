var Vows = require('vows');
var Assert = require('assert');
var Parser = require('../lib/parser');
var Scanner = require('../lib/scanner');
var Lisp = require('../lib/lisp');

var cons = Lisp.cons;
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
        Assert.deepEqual(Parser.parse('(1 . 2)'), cons(number(1), number(2)));
      },

      'parse larger cons': function () {
        Assert.deepEqual(Parser.parse('(1 2 . 3)'),
          cons(
            number(1),
            cons(number(2), number(3) ) )
        );
      }
      // (1 2 . (3 4)) == (1 2 3 4)
      // (1 2 . ()) == (1 2)

    },


    'test parse define' : function () {
      Assert.deepEqual(Parser.parse('(define x "asdf")'),
        cons(symbol('define'),
          cons(symbol('x'),
            cons(string('asdf'),
              nil() ) ) )
      );
    },


    'parse wrapped conss' : function () {
      Assert.deepEqual(Parser.parse('(foo x (foo 5 asdf))'),
        cons(symbol('foo'),
          cons(symbol('x'),
            cons(
              cons(symbol('foo'),
                cons(number('5'),
                  cons(symbol('asdf'), nil() )
                ) ),
              nil() ) ) )
      );
    },

    'parse calculation' : function () {
      Assert.deepEqual(Parser.parse('(- (+ 10 2) 5)'),
        cons(symbol('-'),
          cons(
            cons(symbol('+'),
              cons(number('10'),
                cons(number('2'), nil() ) ) ),
            cons(number('5'), nil() ) ) )
      );
    }

  }).export(module);

