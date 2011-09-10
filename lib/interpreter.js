/*!
 * interpreter
 */

exports.createInterpreter = function createInterpreter(globalEnvironment) {

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

  function applyFunction(func, args, environment) {
    switch (func) {
    case '**define**':
      return define(
        args[0].value,
        _eval(args[1], environment),
        environment
      );

    case '**if**':
      //TODO: implement
      return;

    case '**cond**':
      //TODO: implement
      return;

    case '**lambda**':
      //TODO: implement
      return;

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

  globalEnvironment.put('define', '**define**');

  return {
    eval: _eval
  };

};
