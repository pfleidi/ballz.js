/*!
 * test the scanner
 */


var Assert = require('assert');
var Scanner = require('../lib/scanner');

var expression = '(+ (* 4 5) 4)';
var badExpression0 = '(+ (* 4 5) 4))';
var badExpression1 = '(+ (* 4 5) 4';


var expectedTokens = [
  { token: '(', type: 'L_PAREN' },
  { token: '+', type:'ATOM' },
  { token: '(', type: 'L_PAREN' },
  { token: '*', type:'ATOM' },
  { token: '4', type: 'NUMBER' },
  { token: '5', type: 'NUMBER' },
  { token: ')', type: 'R_PAREN' },
  { token: '4', type: 'NUMBER' },
  { token: ')', type: 'R_PAREN' }
];

exports.tokenize = function tokenize() {
  var tokens = Scanner.tokenize(expression);
  console.dir(tokens);
  Assert.deepEqual(tokens, expectedTokens);
};
