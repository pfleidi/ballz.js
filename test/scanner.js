/*!
 * test the scanner
 */

var Vows = require('vows');
var Assert = require('assert');
var Scanner = require('../lib/scanner');

Vows.describe('evaluate simple instructions').addBatch({

    'scan primitive tokens': {

      'parse number': function () {
        Assert.deepEqual(Scanner.tokenize('5'), [ { type: 'NUMBER', token: '5', line: 1 } ]);
      },

      'parse symbol': function () {
        Assert.deepEqual(Scanner.tokenize('asdf'), [ { type: 'SYMBOL', token: 'asdf', line: 1 } ]);
      },

      'parse string': function () {
        Assert.deepEqual(Scanner.tokenize('"asdf"'), [ { type: 'STRING', token: 'asdf', line: 1 } ]);
      }

    },

    'test scan symbol' : function () {
      var val1 = "(define x 4)";

      Assert.deepEqual(Scanner.tokenize(val1), [
          { token: '(', type: 'L_PAREN', line: 1 },
          { token: 'define', type: 'SYMBOL', line: 1 },
          { token: 'x', type: 'SYMBOL', line: 1 },
          { token: '4', type: 'NUMBER', line: 1 },
          { token: ')', type: 'R_PAREN', line: 1 }
        ]);
    },

    'test scan string' : function () {
      var val1 = "(define x 'asdf')"
      Assert.deepEqual(Scanner.tokenize(val1), [
          { token: '(', type: 'L_PAREN', line: 1 },
          { token: 'define', type: 'SYMBOL', line: 1 },
          { token: 'x', type: 'SYMBOL', line: 1 },
          { token: 'asdf', type: 'STRING', line: 1 },
          { token: ')', type: 'R_PAREN', line: 1 }
        ]); 
    },

    'test scan number' : function () {
      var val1 = "(+ 4 4)"
      Assert.deepEqual(Scanner.tokenize(val1), [
          { token: '(', type: 'L_PAREN', line: 1 },
          { token: '+', type: 'SYMBOL', line: 1 },
          { token: '4', type: 'NUMBER', line: 1 },
          { token: '4', type: 'NUMBER', line: 1 },
          { token: ')', type: 'R_PAREN', line: 1 }
        ]); 
    },

    'test scan complex' : function () {
      var val1 = "(cons 'asdf'\n (cons 4 null))"
      Assert.deepEqual(Scanner.tokenize(val1), [
          { token: '(', type: 'L_PAREN', line: 1 },
          { token: 'cons', type: 'SYMBOL', line: 1 },
          { token: 'asdf', type: 'STRING', line: 1 },
          { token: '(', type: 'L_PAREN', line: 2 },
          { token: 'cons', type: 'SYMBOL', line: 2 },
          { token: '4', type: 'NUMBER', line: 2 },
          { token: 'null', type: 'SYMBOL', line: 2 },
          { token: ')', type: 'R_PAREN', line: 2 },
          { token: ')', type: 'R_PAREN', line: 2 }
        ]); 
    }

  }).export(module);
