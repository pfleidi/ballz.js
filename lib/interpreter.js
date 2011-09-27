/*!
 * interpreter
 */

var Assert = require('assert');
var Environment = require('./environment');
var Lisp = require('./lisp');

// pair shorthands
var car = Lisp.car;
var cdr = Lisp.cdr;

var Eyes = require('eyes');

exports.createInterpreter = function createInterpreter(globalEnvironment) {

  function _eval(expression, environment) {
    environment = environment || globalEnvironment;

    if (Lisp.isSymbol(expression)) {
      return environment.get(expression.value);
    } else if (Lisp.isNumber(expression) || Lisp.isString(expression)) {
      return expression.value;
    } else if (Lisp.isPair(expression)) {
      return evalPair(expression, environment);
    } else {
      return expression;
    }
  }

  function define(key, value, environment) {
    return environment.put(key, value);
  }

  function ifFunc(args, environment) {
    Assert.strictEqual(args.length, 3, 'if: three arguments are needed!');

    if (_eval(args[0], environment)) {
      return _eval(args[1], environment);
    } else {
      return _eval(args[2], environment);
    }
  }

  function condFunc(args, environment) {
    //check for else, if no conditions met
    if (args[0].value[0].type === 'SYMBOL' && args[0].value[0].value === 'else') {
      return _eval(args[0].value[1]);
      //check next condition
    } else if (_eval(args[0].value[0], environment) === true) {
      return _eval(args[0].value[1], environment);
      //check subsequent conditions
    } else if (args.length > 1) {
      return condFunc(args.slice(1), environment);
    }
  }

  function consFunc(args, environment) {
    return Lisp.cons(
      _eval(Lisp.car(args), environment),
      _eval(Lisp.car(Lisp.cdr(args)), environment)
    );
  }

  function carFunc(args, environment) {
    return Lisp.car(_eval(Lisp.car(args), environment));
  }

  function cdrFunc(args, environment) {
    return Lisp.cdr(_eval(Lisp.car(args), environment));
  }

  function createLambda(args, environment) {
    var argList = args[0].value.map(function (param) {
        Assert.strictEqual(param.type, 'SYMBOL');
        return param.value;
      });
    var body = args[1];

    return Lisp.lambda(body, argList);
  }

  function evalLambda(lambda, args, environment) {
    var localEnv = Environment.createEnvironment(environment);
    var currentArg = 0;

    // bind arguments to local environment
    lambda.args.forEach(function (arg) {
        localEnv.put(arg, _eval(args[currentArg]));
        currentArg += 1;
      });

    return _eval(lambda.body, localEnv);
  }

  function applyUserFunction(func, args, environment) {
    if (typeof func === 'function') {
      var evaluatedArgs = Lisp.map(args, function (value) {
          return _eval(value, environment);
        });
      return func(evaluatedArgs);
    } else {
      Assert.strictEqual(func.type, 'LAMBDA');
      return evalLambda(func, args, environment);
    }
  }

  function applyFunction(func, args, environment) {

    switch (func) {
    case '**define**':
      return define(
        Lisp.car(args).value,
        _eval(Lisp.car(Lisp.cdr(args)), environment),
        environment
      );

    case '**if**':
      return ifFunc(args, environment);

    case '**cond**':
      return condFunc(args, environment);

    case '**cons**':
      return consFunc(args, environment);

    case '**car**':
      return carFunc(args, environment);

    case '**cdr**':
      return cdrFunc(args, environment);

    case '**lambda**':
      return createLambda(args, environment);

    case '**quote**':
      return args;

    default:
      return applyUserFunction(
        _eval(func, environment), args, environment);
    }
  }

  function evalPair(expression, environment) {
    return applyFunction(
      _eval(car(expression), environment),
      cdr(expression),
      environment
    );
  }

  globalEnvironment.put('define', '**define**');
  globalEnvironment.put('if', '**if**');
  globalEnvironment.put('cond', '**cond**');
  globalEnvironment.put('cons', '**cons**');
  globalEnvironment.put('car', '**car**');
  globalEnvironment.put('cdr', '**cdr**');
  globalEnvironment.put('lambda', '**lambda**');
  globalEnvironment.put('quote', '**quote**');

  return {
    eval: _eval
  };

};
