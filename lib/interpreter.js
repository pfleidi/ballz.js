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
    } else if(Lisp.isQuote(expression)){
      return expression;
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

  function evalFunc(args, environment){
    if(car(car(args)) && car(car(args)).type === 'QUOTE'){
        return _eval(_eval(car(car(args)).value,environment));
    }
    
    var secondEval = _eval(car(args));

    return secondEval;
  }

  function nilReflFunc(args, environment) {
    var eval = _eval(car(args),environment);
    
    if(eval.type && Lisp.isNil(eval)) {
      return true;
    } else {
      return false;
    }
  }

  function symbolReflFunc(args, environment) {
    var eval = _eval(car(args),environment);

    if(eval.type && Lisp.isSymbol(eval)) {
      return true;
    } else {
      return false;
    }
  }

  function lambdaReflFunc(args, environment) {
    var eval = _eval(car(args), environment);

    if(eval.type && eval.type === 'LAMBDA'){
      return true;
    } else {
      return false;
    }
  }

  function numberReflFunc(args, environment) {
    var eval = _eval(car(args), environment);

    if((typeof eval === 'number') || Lisp.isNumber(eval)){
      return true;
    } else {
      return false;
    }
  }


  function stringReflFunc(args, environment) {
    var eval = _eval(car(args), environment);

    if((typeof eval === 'string') || Lisp.isString(eval)){
      return true;
    } else {
      return false;
    }
  }

  function pairReflFunc(args, environment) {
     var eval = _eval(car(args), environment);

     if(Lisp.isPair(eval)){
       return true;
     } else {
       return false;
     }
  }

  function applyUserFunction(func, args, environment) {

    if (typeof func === 'function') {
      var evaluatedArgs = Lisp.map(args, function (value) {
          return _eval(value, environment);
        });
      return func(evaluatedArgs);
    } else if (func.type === 'QUOTE') {
      
      if(Lisp.isNumber(func.value) || Lisp.isString(func.value)){
        return func.value.value;
      }

      return func.value;
    } 
    else {
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
    
    case '**eval**':
      return evalFunc(args,environment);

    case '**nil?**':
      return nilReflFunc(args,environment);

    case '**symbol?**':
      return symbolReflFunc(args, environment);

    case '**lambda?**':
      return lambdaReflFunc(args, environment);

    case '**number?**':
      return numberReflFunc(args, environment);

    case '**string?**':
      return stringReflFunc(args, environment);

    case '**pair?**':
      return pairReflFunc(args, environment);

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
  globalEnvironment.put('QUOTE', '**quote**');
  globalEnvironment.put('eval','**eval**');
  globalEnvironment.put('nil?','**nil?**');
  globalEnvironment.put('symbol?','**symbol?**');
  globalEnvironment.put('lambda?','**lambda?**');
  globalEnvironment.put('number?','**number?**');
  globalEnvironment.put('string?','**string?**');
  globalEnvironment.put('pair?', '**pair?**');

  return {
    eval: _eval
  };

};
