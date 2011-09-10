/*!
 * test the scanner
 */

var Vows = require('vows');
var Assert = require('assert');
var Scanner = require('../lib/scanner');

Vows.describe('evaluate simple instructions').addBatch({

    'test scan symbol' : function () {
      var val1 = "(define x 4)";

      Assert.deepEqual(Scanner.tokenize(val1), [
          { token: '(', type: 'L_PAREN' },
          { token: 'define', type: 'SYMBOL' },
          { token: 'x', type: 'SYMBOL' },
          { token: '4', type: 'NUMBER' },
          { token: ')', type: 'R_PAREN' }
        ]);
    },

    'test scan string' : function () {
      var val1 = "(define x 'asdf')"
      Assert.deepEqual(Scanner.tokenize(val1), [
          { token: '(', type: 'L_PAREN' },
          { token: 'define', type: 'SYMBOL' },
          { token: 'x', type: 'SYMBOL' },
          { token: 'asdf', type: 'STRING' },
          { token: ')', type: 'R_PAREN' }
        ]); 
    },

    'test scan number' : function () {
      var val1 = "(+ 4 4)"
      Assert.deepEqual(Scanner.tokenize(val1), [
          { token: '(', type: 'L_PAREN' },
          { token: '+', type: 'SYMBOL' },
          { token: '4', type: 'NUMBER' },
          { token: '4', type: 'NUMBER' },
          { token: ')', type: 'R_PAREN' }
        ]); 
    },

    'test scan complex' : function () {
      var val1 = "(cons 'asdf' (cons 4 null))"
      Assert.deepEqual(Scanner.tokenize(val1), [
          { token: '(', type: 'L_PAREN' },
          { token: 'cons', type: 'SYMBOL' },
          { token: 'asdf', type: 'STRING' },
          { token: '(', type: 'L_PAREN'},
          { token: 'cons', type: 'SYMBOL' },
          { token: '4', type: 'NUMBER' },
          { token: 'null', type: 'SYMBOL'},
          { token: ')', type: 'R_PAREN'},
          { token: ')', type: 'R_PAREN'}
        ]); 
    }

  }).export(module);
