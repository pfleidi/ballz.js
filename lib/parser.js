var Assert = require('assert');
var Scanner = require(__dirname + '/scanner');

var parse = exports.parse = function parse(input) {
  var tokens = Scanner.tokenize(input);
  var currentPosition = -1;
  
  function peekToken() {
    if ((tokens.length - 1) > currentPosition) {
      return tokens[currentPosition + 1];
    } else {
      return 'EOF';
    }
  }

  function nextToken() {
    var token = peekToken();
    currentPosition += 1;
    return token;
  }
  
  function buildAST(node) {
    var token = nextToken();
    var astToken = {};

    if (token.type === 'L_PAREN') {
      astToken.type = 'PAIR';
      astToken.value = [];
      astToken.parent = node;
      node.value.push(astToken);
      buildAST(astToken);
      return astToken;
    } else if (token.type === 'R_PAREN') {
      Assert.ok(node.parent, 'Matching parenthesis expected!');
      buildAST(node.parent);
      delete node.parent;
      return;
    } else if (token.type === 'NUMBER') {
      astToken.type = 'NUMBER';
      astToken.value = token.token;
      node.value.push(astToken);
      buildAST(node);
      return;
    } else if (token.type === 'STRING') {
      astToken.type = 'STRING';
      astToken.value = token.token;
      node.value.push(astToken);
      buildAST(node);
      return;
    } else if (token.type === 'SYMBOL') {
      astToken.type = 'SYMBOL';
      astToken.value = token.token;
      node.value.push(astToken);
      buildAST(node);
      return;
    }
  }

  return buildAST({ value: [] });
};
