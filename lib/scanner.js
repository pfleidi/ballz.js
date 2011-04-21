/*!
 * Lisp syntax scanner
 */

exports.tokenize = function tokenize(input) {
  var currentPosition = -1;
  var buffer = [];
  var tokens = [];
  var seperators = [' ', '(', ')'];

  function peek() {
    var nextIndex = currentPosition + 1;

    if (nextIndex >= input.length) {
      return 'EOF';
    } else {
      return input.charAt(nextIndex);
    }
  }

  function next() {
    var nextChar = peek();

    currentPosition += 1;

    return nextChar;
  }

  function clearBuffer() {
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
  }

  function read() {

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
  }

  return read(input);
};
