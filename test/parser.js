var Vows = require('vows');
var Assert = require('assert');
var Parser = require('../lib/parser');
var Scanner = require('../lib/scanner');

Vows.describe('evaluate simple instructions').addBatch({

    'test parse define' : function () {
      Assert.deepEqual(Parser.parse('(define x "asdf")'), {
          type: 'PAIR',
          value: [
            { type: 'SYMBOL', value: 'define' },
            { type: 'SYMBOL', value: 'x'},
            { type: 'STRING', value: 'asdf'}
          ] 
        });
    },

    'parse cons' : function () {
      Assert.deepEqual(Parser.parse('(cons x (cons 5 null))'), {
          type: 'PAIR',
          value: [
            { type: 'SYMBOL', value: 'cons'},
            { type: 'SYMBOL', value: 'x'},
            { type: 'PAIR', value: [
                { type: 'SYMBOL', value: 'cons'},
                { type: 'NUMBER', value: '5'},
                { type: 'SYMBOL', value: 'null'}
              ] } ]
        });
    },

    'parse multiple' : function () {
      Assert.deepEqual(Parser.parse('(cons x (cons 5 null))'), {
          type: 'PAIR',
          value: [
            { type: 'SYMBOL', value: 'cons' },
            { type: 'SYMBOL', value: 'x' },
            { type: 'PAIR', value: [
                { type: 'SYMBOL', value: 'cons' },
                { type: 'NUMBER', value: '5' },
                { type: 'SYMBOL', value: 'null' }
              ] } ]
        });
    },

    'parse calculation' : function () {
      Assert.deepEqual(Parser.parse('(- (+ 10 2) 5)'), {
          type: 'PAIR',
          value: [
            { type: 'SYMBOL', value: '-' },
            { type: 'PAIR', value: [
                { type: 'SYMBOL', value: '+' },
                { type: 'NUMBER', value: 10 },
                { type: 'NUMBER', value: 2 }
              ] },
            { type: 'NUMBER', value: 5 }
          ]
        });
    }

  }).export(module);

