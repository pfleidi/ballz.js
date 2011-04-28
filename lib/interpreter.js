/*!
 * interpreter
 */

function applyFunction(func, args, environment) {
  return func(
    args.map(function (value) {
        return myEval(value, environment);
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
      myEval(expression.value[2], environment),
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
      myEval(expression.value[0], environment),
      expression.value.slice(1),
      environment  
    );
  }
}

var myEval = exports.myEval = function myEval(expression, environment) {
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
};
