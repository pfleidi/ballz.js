/*!
 * Interpreter unit test
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
var quote = Lisp.quote;

Vows.describe('evaluate simple instructions').addBatch({

    'eval number expressions' : function () {
      var number1 = interpreter.eval(number('23.42'));
      Assert.strictEqual(number1, 23.42);

      var number2 = interpreter.eval(number('12345'));
      Assert.strictEqual(number2, 12345);
    },

    'eval boolean expressions' : function () {
      var env = Environment.createEnvironment();
      var bool1 = interpreter.eval(symbol('#t'));
      Assert.strictEqual(bool1, true);

      var bool2 = interpreter.eval(symbol('#f'));
      Assert.strictEqual(bool2, false);
    },

    'eval string expressions' : function () {
      var env = Environment.createEnvironment();
      env.put('str', 'ASDF! fsklj;la');

      var str1 =  interpreter.eval(symbol('str'), env);
      Assert.strictEqual(str1, 'ASDF! fsklj;la');

      var str2 = interpreter.eval(string('Hurr Durr Derp!'));
      Assert.strictEqual(str2, 'Hurr Durr Derp!');
    },

    'eval sequences' : {

      '(+ 10 32) == 42' : function () {
        var val = interpreter.eval(
          cons(symbol('plus'),
            cons(number('10'),
              cons(number('32'), nil() ) ) )
        );

        Assert.strictEqual(val, 42);
      },

      '(- someVal 3) == 1337' : function () {
        var env = Environment.createEnvironment();
        env.put('someVal', 1340);

        var val = interpreter.eval(
          cons(symbol('minus'),
            cons(symbol('someVal'),
              cons(number('3'), nil() ) ) ),
          env
        );

        Assert.strictEqual(val, 1337);
      },

    },

    '(define someVal 3)' : function () {
      var val1 = interpreter.eval(
        cons(symbol('define'),
          cons(symbol('someVal'),
            cons(number('3'), nil() ) ) )
      );
      Assert.strictEqual(val1, 3);

      var val2 = interpreter.eval(symbol('someVal'));
      Assert.strictEqual(val2, 3);
    },

    '(define foo (cons "asdf" 3))' : function () {

      var val1 = interpreter.eval(
        cons(symbol('define'),
          cons(symbol('foo'),
              cons(
                cons(symbol('cons'),
                  cons(string('asdf'),
                    cons(number('3'), nil() ) ) ),
                nil() ) ) )
      );

      Assert.deepEqual(val1, cons('asdf', 3));

      var val2 = interpreter.eval(symbol('foo'));
      Assert.deepEqual(val2, cons('asdf', 3));

      var val3 = interpreter.eval(
        cons(symbol('car'),
          cons(symbol('foo'), nil() ) )
      );

      Assert.strictEqual(val3, 'asdf');

      var val4 = interpreter.eval(
        cons(symbol('cdr'),
          cons(symbol('foo'), nil() ) )
      );

      Assert.strictEqual(val4, 3);
    },

    '(car (cons "asdf" 3))' : function () {
      var val1 = interpreter.eval(
        cons(symbol('car'),
          cons(
            cons(symbol('cons'),
              cons(string('asdf'),
                cons(number('3'), nil() ) ) ),
            nil() ) )
      );

      Assert.strictEqual(val1, 'asdf');
    },


    '(cdr (cons "asdf" 3))' : function () {
      var val1 = interpreter.eval(
        cons(symbol('cdr'),
          cons(
            cons(symbol('cons'),
              cons(string('asdf'),
                cons(number('3'), nil() ) ) ),
            nil() ) )
      );

      Assert.strictEqual(val1, 3);
    },

    '(if (equals 1 1) #t #f)' : function () {
      var val1 = interpreter.eval(
        cons(symbol('if'),
          cons(
            cons(symbol('equals'),
              cons(number('1'),
                cons(number('1'), nil() ) ) ),
            cons(symbol('#t'),
              cons(symbol('#f'), nil() ) ) ) )
      );

      Assert.strictEqual(val1, true);
    },

    '(if (equals 1 2) #t #f)' : function () {
      var val1 = interpreter.eval(
        cons(symbol('if'),
          cons(
            cons(symbol('equals'),
              cons(number('1'),
                cons(number('2'), nil() ) ) ),
            cons(symbol('#t'),
              cons(symbol('#f'), nil() ) ) ) )
      );

      Assert.strictEqual(val1, false);
    },


    '(cond (#f 1) (#t 2))' : function () {
      var val1 = interpreter.eval(
        cons(symbol('cond'),
          cons(
            cons(symbol('#f'),
                cons(number('1'), nil() ) ),
            cons(cons(symbol('#t'),
                  cons(number('2'), nil() ) ),
                nil() ) ) )
      );

      Assert.strictEqual(val1, 2);
    },

    '(cond (#t 1) (#f 2))' : function () {
      var val1 = interpreter.eval(
        cons(symbol('cond'),
          cons(
            cons(symbol('#t'),
              cons(number('1'), nil() ) ),
            cons(cons(symbol('#t'),
                cons(number('2'), nil() ) ),
              nil() ) ) )
      );

      Assert.strictEqual(val1, 1);
    },

    '(cond (#f 1) (#f 2) (else 3))' : function () {
      var val1 = interpreter.eval(
        cons(symbol('cond'),
          cons(
            cons(symbol('#f'),
              cons(number('1'), nil() ) ),
            cons(cons(symbol('#f'),
                cons(number('2'), nil() ) ),
              cons(cons(symbol('else'),
                  cons(number('3'), nil() ) ),
                nil() ) ) ) )
        );

        Assert.strictEqual(val1, 3);
      },

      '(cond (else "foo"))' : function () {
        var val1 = interpreter.eval(
          cons(symbol('cond'),
            cons(
              cons(symbol('else'),
                cons(string('foo'), nil())),
              nil()))
        );

        Assert.strictEqual(val1, 'foo');
      },

      'eval lambda statements' : {

        '((lambda (n) (multiply n 10)) 3)' : function () {
          var val = interpreter.eval(
            cons(
              cons(symbol('lambda'),
                cons(
                  cons(symbol('n'), nil()),
                  cons(
                    cons(symbol('multiply'),
                      cons(symbol('n'),
                        cons(number('10'), nil() ) ) ),
                    nil() ) ),
                nil() ),
              cons(number('3'), nil() ) )
          );
        }
      },

      'eval quote' : {
       '(quote (plus 1 1))' : function () {
          var val = interpreter.eval(
            cons(
              quote(
                cons(symbol('plus'),
                    cons(number('1'),
                          cons(number('1'),nil())
                         )
                    )
              ), nil()
            )
          );
        
          Assert.deepEqual(val, 
            cons(symbol('plus'),
                cons(number('1'),
                     cons(number('1'), nil()
                         )
                    )
                )
          );
       },

       '(quote 1)' : function () {
          var val = interpreter.eval(
            cons(quote(
              number('1')
            ), nil())
          );

          Assert.strictEqual(val, 1);
       },

       '(quote \'foo\')' : function () {
         var val = interpreter.eval(
            cons(quote(
              string('foo')
            ), nil())
          );

          Assert.deepEqual(val, 'foo');

       }
    },

    'eval eval' : {
      '(eval (quote (plus 1 1)))' : function () {
        var val = interpreter.eval(
          cons(symbol('eval'),
               cons(
                 cons(
                    quote(
                      cons(symbol('plus'),
                          cons(number('1'),
                            cons(number('1'),nil())
                          )
                      )
                    ), nil()
                  ), nil()
               )
          )
        );

        Assert.strictEqual(val, 2);
      },

      '(eval (quote 1))' : function () {
        var val = interpreter.eval(
          cons(symbol('eval'),
               cons(cons(quote(number('1')),nil()),nil()))
        );

        Assert.strictEqual(val, 1);
      },

      '(eval 1)' : function () {
        var val = interpreter.eval(
          cons(symbol('eval'), cons(number('1'),nil()))
        );

        Assert.strictEqual(val, 1);
      },

      '(eval (plus 1 1))' : function () {
        var val = interpreter.eval(
          cons(symbol('eval'),
            cons(
              cons(symbol('plus'),
                  cons(number('1'),
                      cons(number('1'), nil())
                  )
              ), nil()
            )
          )
        );

        Assert.strictEqual(val, 2);
      }
    }


    }).export(module);
