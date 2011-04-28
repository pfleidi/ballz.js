/*!
 * interpreter
 */

exports.createInterpreter = function createInterpreter(globalEnvironment) {

  function applyFunction(func, args, environment) {
    return func(
      args.map(function (value) {
          return _eval(value, environment);
        })
    );
  }

  function define(key, value, environment) {
    return environment.put(key, value);
  }

  function evalPair(expression, environment) {
    switch (expression.value[0].value) {
    case 'define':
      return define(
        expression.value[1].value,
        _eval(expression.value[2], environment),
        environment
      );

    case 'if':
      //TODO: implement
      return;

    case 'cond':
      //TODO: implement
      return;

    case 'lambda':
      //TODO: implement
      return;

    default:
      return applyFunction(
        _eval(expression.value[0], environment),
        expression.value.slice(1),
        environment  
      );
    }
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

  return {
    eval: _eval
  };

};
