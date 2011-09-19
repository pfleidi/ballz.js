/*!
 * interpreter
 */

var Assert = require('assert');
exports.createInterpreter = function createInterpreter(globalEnvironment) {

  function _eval(expression, environment) {
    environment = environment || globalEnvironment;

    switch (expression.type) {
    case 'SYMBOL':
      return environment.get(expression.value);
    case 'NUMBER':
      return Number(expression.value);
    case 'STRING':
      return String(expression.value);
    case 'PAIR':
      return evalPair(expression, environment);
    default:
      return expression;
    }
  }

  function applyUserFunction(func, args, environment) {
    return func(
      args.map(function (value) {
          return _eval(value, environment);
        })
    );
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

  function applyFunction(func, args, environment) {
    switch (func) {
    case '**define**':
      return define(
        args[0].value,
        _eval(args[1], environment),
        environment
      );

    case '**if**':
      return ifFunc(args, environment);

    case '**cond**':
      return condFunc(args, environment);

    case '**lambda**':
      //TODO: implement
      throw 'Not implemented';

    default:
      return applyUserFunction(
        _eval(func, environment), args, environment);
    }
  }

  function evalPair(expression, environment) {
    return applyFunction(
      _eval(expression.value[0]),
      expression.value.slice(1),
      environment
    );
  }

  globalEnvironment.put('define', '**define**');
  globalEnvironment.put('if', '**if**');
  globalEnvironment.put('cond', '**cond**');
  globalEnvironment.put('lambda', '**lambda**');

  return {
    eval: _eval
  };

};
