var Scanner = require('./scanner');

var parse = exports.parse = function parse(input){
  var tokens = Scanner.tokenize(input);
  var currentPosition = -1;
  var ast = {type: 'PAIR', value: []};
  
  function peakToken(){
    if(tokens.length-1 > currentPosition) {
      return tokens[currentPosition+1];
    } else {
      return 'EOF';
    }
  }

  function nextToken() {
    var token = peakToken();
    currentPosition += 1;
    return token;
  }
  
  function buildAST(node){
    var token = nextToken();
    var astToken = {type: '', value: []};
    if(token.type === 'L_PAREN') {
      astToken.type = 'PAIR';
      astToken.value = [];
      node.value.push(astToken);
      buildAST(astToken);
      return;
    } else if(token.type === 'R_PAREN') {
      buildAST(ast);
      return;
    } else if(token.type === 'NUMBER'){
      astToken.type = 'NUMBER';
      astToken.value = token.token;
      node.value.push(astToken);
      buildAST(node);
      return;
    } else if(token.type === 'STRING') {
      astToken.type = 'STRING';
      astToken.value = token.token;
      node.value.push(astToken);
      buildAST(node);
      return;
    } else if(token.type === 'SYMBOL') {
      astToken.type = 'SYMBOL';
      astToken.value = token.token;
      node.value.push(astToken);
      buildAST(node);
      return;
    }
  }

  buildAST(ast);
  return ast;
};
