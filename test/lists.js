/*
 * List structure unit tests
 */


var Vows = require('vows');
var Assert = require('assert');
var Environment = require('../lib/environment');
var interpreter = require('../lib/interpreter').createInterpreter(
  Environment.createEnvironment()
);

var Lisp = require('../lib/lisp');

var cons = Lisp.cons;
var number = Lisp.number;
var string = Lisp.string;
var symbol = Lisp.symbol;
var nil = Lisp.nil;


Vows.describe('test list structures').addBatch({

    'eval cons' : function () {
      // (define foo (cons 'asdf' 3))
			var val1 = interpreter.eval(
        cons(symbol('define'),
          cons(symbol('foo'),
              cons(
                cons(symbol('cons'),
                  cons(string('asdf'),
                    cons(number('3'), nil() ) ) ),
                nil() ) ) )
      );

			
      Assert.deepEqual(val1, cons('asdf',3));

      var val2 = interpreter.eval(
				symbol('foo')
			);

      Assert.deepEqual(val2, cons('asdf',3));
    },

    'eval car' : function () {
      // (car (cons 'asdf' 3))
      var val1 = interpreter.eval(
				cons(symbol('car'),
						cons(
							cons(symbol('cons'),
									cons(string('asdf'),
											cons(number('3'), nil)
											)), nil)
			));

      Assert.strictEqual(val1, 'asdf');
    },

    'eval cdr' : function () {
      // (cdr (cons 'asdf' 3))
			var val1 = interpreter.eval(
				cons(symbol('cdr'),
						cons(
							cons(symbol('cons'),
									cons(string('asdf'),
											cons(number('3'), nil)
											)), nil)
			));

      Assert.strictEqual(val1, 3);
    }

  }).export(module);
