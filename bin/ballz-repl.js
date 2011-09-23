#!/usr/bin/env node

/*!
 * BALLZ repl module
 *
 * @author pfleidi
 */

var Readline = require('readline');
var Eyes = require('eyes');

var Parser = require('../lib/parser');
var Environment = require('../lib/environment');
var interpreter = require('../lib/interpreter').createInterpreter(
  Environment.createEnvironment()
);

var repl = Readline.createInterface(process.stdin, process.stdout);

function exec(cmd) {
  var ast = Parser.parse(cmd);
  return Eyes.inspect(interpreter.eval(ast));
}

repl.setPrompt('ballz >');

repl.on('line', function (cmd) {
    try {
      console.log('==> ' + exec(cmd));
    } catch (e) {
      console.log(e.message);
      console.log(e.stack);
    }
    repl.prompt();
  });

repl.on('SIGINT', function () {
    repl.close();
  });

repl.on('close', function () {
    console.log('goodbye!');
    process.exit(0);
  });


repl.prompt();
