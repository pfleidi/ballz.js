/*!
 * interpreter
 */

var Assert = require('assert');
var Environment = require('./environment');
var Lisp = require('./lisp');

// pair shorthands
var car = Lisp.car;
var cdr = Lisp.cdr;
var length = Lisp.length;
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
    Assert.strictEqual(length(args), 3, 'if(): three arguments are needed!');

    if (_eval(car(args), environment)) {
      return _eval(car(cdr(args)), environment);
    } else {
      return _eval(car(cdr(cdr(args))), environment);
    }
  }

  function condFunc(args, environment) {
    //check for else, if no conditions met
    if (Lisp.isSymbol(car(car(args))) && car(car(args)).value === 'else') {
      return _eval(car(cdr(car(args))), environment);
      //check next condition
    } else if (_eval(car(car(args)), environment) === true) {

      return _eval(car(cdr(car(args))), environment);
      //check subsequent conditions
    } else if (length(args) > 1) {
      return condFunc(cdr(args), environment);
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

    var argsList = [],
        currentArg = car(args),
        body = cdr(args);

    do {
      if(car(currentArg).type === 'SYMBOL') {
        argsList.push(car(currentArg).value);
      }

      currentArg = cdr(currentArg);

    } while (!Lisp.isNil(currentArg));

    return Lisp.lambda(body, argsList);
  }

  function evalLambda(lambda, args, environment) {

    var localEnv = Environment.createEnvironment(environment),
        argsList = [],
        currentArg = args,
        argIndex = 0;

    do {
      argsList.push(car(currentArg));

      currentArg = cdr(currentArg);

    } while (!Lisp.isNil(currentArg));

    // bind arguments to local environment
    lambda.args.forEach(function (arg) {
      localEnv.put(arg, _eval(argsList[argIndex]));
        argIndex += 1;
    });

    return _eval(car(lambda.body), localEnv);
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
