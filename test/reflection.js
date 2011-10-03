/*!
 * test reflections
 */

var Assert = require('assert');
var Vows = require('vows');
var Lisp = require('../lib/lisp');
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
var quote = Lisp.quote;

Vows.describe('Test reflections').addBatch({

    'test number?' : {
      '(number? 5)' : function () {

        var val = interpreter.eval(
          cons(symbol('number?'),
            cons(number('5'), nil()
                )
              )
        );

        Assert.strictEqual(val, true);
      },

      '(number? (plus 1 1))' : function () {
        var val = interpreter.eval(
          cons(symbol('number?'),
            cons(
              cons(symbol('plus'),
                  cons(number('1'),
                    cons(number('1'),nil()
                        )
                      )
                  ), nil()
                )
              )
        );

        Assert.strictEqual(val, true);
      },

      '(number? (quote 5))' : function () {
        var val = interpreter.eval( 
        cons(symbol('number?'),
            cons(
              cons(quote(number('5'))
                   ,nil()
                  ),
                  nil()
            )
            )
        );
        Assert.strictEqual(val, true);
      },

      "(number? 'foo')" : function () {
        var val = interpreter.eval(
          cons(symbol('number?'),
               cons(string('foo'), nil()))
        );

        Assert.strictEqual(val ,false);
      }
    },

    'test nil?' : {
      '(nil? (quote ()))' : function () {
        var val = interpreter.eval(
          cons(symbol('nil?'),
               cons(
                 cons(quote(nil()),nil()), nil()))
        );

        Assert.strictEqual(val, true);
      },
    },

    'test symbol?' : {
      '(symbol? (quote a))' : function () {
        var val = interpreter.eval(
          cons(symbol('symbol?'),
               cons(
                 cons(quote(symbol('a')), nil()), nil()))
        );

        Assert.strictEqual(val, true);
      },

      '(symbol? (plus 1 1))' : function () {
        var val = interpreter.eval(
          cons(symbol('symbol?'),
               cons(symbol('plus'),
                    cons(number('1'),
                                cons(number('1'),nil()))))
        );

        Assert.strictEqual(val, false);
      }
    }, 

    'test lambda?' : {
      '(lambda? (lambda (a) (plus a a))' : function () {
        var val = interpreter.eval(
          cons(symbol('lambda?'),
               cons(
               cons(symbol('lambda'),
                    cons(
                      cons(symbol('a'), nil()),
                      cons(
                        cons(symbol('plus'),
                          cons(symbol('a'),
                               cons(symbol('a'),nil())
                          )
                        ), nil()
                      )
                    )
                   )
              , nil()))
        );

        Assert.strictEqual(val, true);
      }
    },

    'test string?' : {
      '(string? "foo"' : function () {
        var val = interpreter.eval(
          cons(symbol('string?'),
               cons(string('foo'),nil()))
        );

        Assert.strictEqual(val, true);
      },

      '(string? 5)' : function () {
        var val = interpreter.eval(
          cons(symbol('string?'),
               cons(number('5'), nil()))
        );

        Assert.strictEqual(val, false);
      }
    }, 

    'test pair?' : {
      '(pair? (cons 1 2)' : function () {
        var val = interpreter.eval(
          cons(symbol('pair?'),
                cons(
                  cons(symbol('cons'),
                       cons(number('1'),
                            cons(number('2'),nil()
                                )
                           )
                      ), nil())
              )
        );

        Assert.strictEqual(val, true);
      },
    }
}).export(module);


