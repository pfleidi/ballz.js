/*!
 * Lisp syntax scanner
 */

exports.tokenize = function tokenize(input) {
  var currentPosition = -1,
      buffer = [],
      tokens = [],
      seperators = [' ', '(', ')', '\n'],
      currLine = 1;

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
    var token = buffer.join(''),
        currToken = { token: token, type: null, line: currLine },
        skip = false;

    // FIXME: refactor me
    if (token === '') {
      return;
    }

    if (token === '(') {
      currToken.type = 'L_PAREN';
    } else if (token === ')') {
      currToken.type = 'R_PAREN';
    } else if (token === '.') {
      currToken.type = 'DOT';
    } else if (/\n/.test(token)) {
      currLine += 1;
      skip = true;
    } else if (/^\s$/.test(token)) {
      // whitespace is ignored
      skip = true;
    } else if (token === ';') {
      currToken.type = 'COMMENT';
    } else if (/\d/.test(token)) {
      currToken.type = 'NUMBER';
    } else if (/^(".*")$/.test(token)) {
      currToken.token = token.substring(1, token.length - 1);
      currToken.type = 'STRING';
    } else if (token === 'quote') {
      currToken.type = 'QUOTE';
    } else {
      currToken.type = 'SYMBOL';
    }

    if (!skip) {
      tokens.push(currToken);
    } else {
      skip = false;
    }
    buffer = [];
  }

  function read() {
    var bufferLocked = false, nextChar;

    while (peek() !== 'EOF') {
      nextChar = peek();

      if (nextChar === '\'' || nextChar === '\"') {
        bufferLocked = !bufferLocked;
      }

      if (!bufferLocked && seperators.indexOf(nextChar) !== -1) {
        clearBuffer();
      }

      buffer.push(nextChar);

      if (!bufferLocked && seperators.indexOf(nextChar) !== -1) {
        clearBuffer();
      }

      next();
    }
    clearBuffer();
    return tokens;
  }

  return read(input);
};
