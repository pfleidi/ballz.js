/*!
 * tokenstream.js
 *
 * helper module to work with token streams
 */

exports.createStream = function createStream(tokens) {

  var currPosition = 0;

  function peek() {
    if (tokens.length > currPosition) {
      return tokens[currPosition];
    } else {
      return 'EOF';
    }
  }

  function next() {
    var token = peek();
    currPosition += 1;
    return token;
  }

  return {
    peek: peek,
    next: next
  };
};
