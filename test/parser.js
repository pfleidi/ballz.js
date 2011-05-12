var Assert = require('assert');
var Parser = require('../lib/parser');
var Scanner = require('../lib/scanner');
exports['test parse define'] = function () {
  var val1 = [ 
    { token: '(', type: 'L_PAREN' },
    { token: 'define', type: 'SYMBOL' },
    { token: 'x', type: 'SYMBOL' },
    { token: 'asdf', type: 'STRING' },
    { token: ')', type: 'R_PAREN' } ];
  
  Assert.deepEqual(Parser.parse(val1), {
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
  var val1 = Scanner.tokenize('(cons x (cons 5 null))');
  Assert.deepEqual(Parser.parse(val1), {
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
  var val1 = Scanner.tokenize("(cons x (cons 5 null)) (define x 'asdf')");
  
  Assert.deepEqual(Parser.parse(val1), {
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
