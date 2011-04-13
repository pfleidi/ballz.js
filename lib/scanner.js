var sys = require('sys');
var text;
var currentPosition = -1;
var buffer = [];
var tokens = [];
var seperators = [' ','(',')'];

var next = function () {
  var nextChar = peek();

  currentPosition += 1;
  
  return nextChar;
}

var peek = function () {
  var nextIndex = currentPosition + 1;

  if(nextIndex >= text.length){
    return 'EOF'
  } else {
    return text.charAt(nextIndex);
  }
}

var clearBuffer = function () {
  var token = buffer.join('');
  
  //ugly 
  if(token === '')
    return;

  if(token === '('){
    tokens.push({ token : '(', type : 'L_PAREN'});
  } else if(token === ')'){
    tokens.push({ token : ')', type : 'R_PAREN'});
  } else if(/\s/.test(token)){
    //tokens.push({ token: token, type: 'WHITESPACE'});  
  } else if(/\d/.test(token)){
    tokens.push({ token: token, type : 'NUMBER'});
  } else {
    tokens.push({ token: token, type : 'ATOM'});
  }

  buffer = [];
}

var read = function (input) {

  text = input;

  while(peek() !== 'EOF'){
    var nextChar = peek();

    if(seperators.indexOf(nextChar) != -1){
      clearBuffer();
    }

    buffer.push(nextChar);
    
    if(seperators.indexOf(nextChar) != -1){
      clearBuffer();
    }
    next();
  }
  
  return tokens;
}

exports.tokenize = function tokenize(input){
  return read(input);
}

