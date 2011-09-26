/*!
 * lisp.js
 *
 * build LISP data types
 */



module.exports = {

  nil: function nil() {
    return { type: 'NULL' }
  },

  pair: function pair(left, right) {
    if (left.type === 'NULL' && right.type === 'NULL') {
      return this.nil();
    }
    return {
      type: 'PAIR',
      left: left,
      right: right
    };
  },

  number: function number(value) {
    return {
      type: 'NUMBER',
      value: Number(value)
    };
  },

  string: function string(value) {
    return {
      type: 'STRING',
      value: String(value)
    }
  },

  symbol: function symbol(value) {
    return {
      type: 'SYMBOL',
      value: value
    };
  }

};
