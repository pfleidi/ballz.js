/*!
 * interpreter
 */

/*
 * RULES:
 *
 * if atom and not symbol, return expr
 *
 * if sequence:
 *      get first element
 *      get function (first el)
 *      eval arguments recursive
 *      call function with evaluated arguments
 *
 * if list (cons x y):
 *      eval x and y recursive
 *      make new cons from evaluated arguments
 *
 * if string: return string
 */

exports.eval = function eval(expression, environment) {
};
