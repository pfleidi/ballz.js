var Assert = require('assert');
var Parser = require('../lib/parser');
var Scanner = require('../lib/scanner');
exports['test parse define'] = function () {
  Assert.deepEqual(Parser.parse("(define x 'asdf')"), {
    type: 'PAIR',
    value: [
      { type: 'PAIR',
        value: [
          { type: 'SYMBOL', value: 'define' },
          { type: 'SYMBOL', value: 'x'},
          { type: 'STRING', value: 'asdf'}
        ]}
    ]
  });
};

exports['parse cons'] = function () {
  Assert.deepEqual(Parser.parse("(cons x (cons 5 null))"), {
    type: 'PAIR',
    value: [
      { type: 'PAIR',
        value: [
          { type: 'SYMBOL', value: 'cons'},
          { type: 'SYMBOL', value: 'x'},
          { type: 'PAIR', value: [
            { type: 'SYMBOL', value: 'cons'},
            { type: 'NUMBER', value: '5'},
            { type: 'SYMBOL', value: 'null'}
          ]}
        ]}
    ]
  });
};

exports['parse multiple'] = function () {
  Assert.deepEqual(Parser.parse("(cons x (cons 5 null)) (define x 'asdf')"), {
    type: 'PAIR',
    value: [
      { type: 'PAIR',
        value: [
          { type: 'SYMBOL', value: 'cons'},
          { type: 'SYMBOL', value: 'x'},
          { type: 'PAIR', value: [
            { type: 'SYMBOL', value: 'cons'},
            { type: 'NUMBER', value: '5'},
            { type: 'SYMBOL', value: 'null'}
          ]}
        ]}, 
      { type: 'PAIR',
        value: [
          { type: 'SYMBOL', value: 'define' },
          { type: 'SYMBOL', value: 'x'},
          { type: 'STRING', value: 'asdf'}
      ]}]
  });
};
