/*!
 * Lisp syntax scanner
 */

exports.tokenize = function tokenize(input) {
  var text;
  var currentPosition = -1;
  var buffer = [];
  var tokens = [];
  var seperators = [' ', '(', ')'];

  var peek = function peek() {
    var nextIndex = currentPosition + 1;

    if (nextIndex >= text.length) {
      return 'EOF';
    } else {
      return text.charAt(nextIndex);
    }
  };

  var next = function () {
    var nextChar = peek();

    currentPosition += 1;

    return nextChar;
  };

  var clearBuffer = function () {
    var token = buffer.join('');

    // FIXME: refactor me
    if (token === '') {
      return;
    }

    if (token === '(') {
      tokens.push({
          token: '(',
          type: 'L_PAREN'
        });
    } else if (token === ')') {
      tokens.push({
          token: ')',
          type: 'R_PAREN'
        });
    } else if (/\s/.test(token)) {
      //tokens.push({ token: token, type: 'WHITESPACE'});  
    } else if (/\d/.test(token)) {
      tokens.push({
          token: token,
          type: 'NUMBER'
        });
    } else {
      tokens.push({
          token: token,
          type: 'ATOM'
        });
    }

    buffer = [];
  };

  var read = function (input) {
    text = input;

    while (peek() !== 'EOF') {
      var nextChar = peek();

      if (seperators.indexOf(nextChar) !== -1) {
        clearBuffer();
      }

      buffer.push(nextChar);

      if (seperators.indexOf(nextChar) !== -1) {
        clearBuffer();
      }
      next();
    }
    return tokens;
  };

  return read(input);
};
