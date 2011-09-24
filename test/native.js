var Vows = require('vows');
var Fs = require('fs');
var Parser = require('../lib/parser');
var Environment = require('../lib/environment');
var interpreter = require('../lib/interpreter').createInterpreter(
  Environment.createEnvironment()
);

var dirname = __dirname + '/ballz';

Vows.describe('evaluate native ballz code').addBatch({

    'test ballz code' : function () {
      Fs.readdirSync(dirname).forEach(function (filename) {
        var content = Fs.readFileSync(dirname + '/' + filename, 'utf8');

        content.split('\n').forEach(function (line) {
            if (line.match(/\(.*\)/)) {
              var parsed = Parser.parse(line);
              interpreter.eval(parsed);
            }
          });
      });
  }

}).export(module);
