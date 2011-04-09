/*!
 * scanner.js
 */

function _read(input) {
  var tokens = [];

  for (var i = 0; i < input.length; i += 1) {
    var currentChar = input.charAt(i);

    if (currentChar === '(') {
      tokens.push({ token: '(', type: 'L_PAREN' });
      } else if (currentChar === ')') {
        tokens.push({ token: ')', type: 'R_PAREN' });
      } else if (/\s/.test(currentChar)) {
        tokens.push({ token: currentChar, type: 'WHITESPACE' });
      } else if (/\d/.test(currentChar)) {
        tokens.push({ token: currentChar, type: 'NUMBER' });
      } else if (/["']/.test(currentChar)) {
        tokens.push({ token: currentChar, type: 'QUOTE'});
      } else {
        tokens.push({ token: currentChar, type: 'ATOM' });
      }
    }

    return tokens;

  }

  exports.tokenize = function tokenize(input) {
    return _read(input);
  };
