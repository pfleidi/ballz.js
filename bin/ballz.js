#!/usr/bin/env node
/*!
 * ballz.js
 *
 * interprets any given file
 */

var Fs = require('fs');
var Parser = require('../lib/parser');
var Environment = require('../lib/environment');
var interpreter = require('../lib/interpreter').createInterpreter(
  Environment.createEnvironment()
);


var filename = process.argv[2];

Fs.readFile(filename, 'utf8', function (err, content) {
    if (err) {
      throw err;
    }

    content.split('\n').forEach(function (line) {
      if (line.match(/\(.*\)/)) {
        var parsed = Parser.parse(line);
        interpreter.eval(parsed);
      }
    });
  });
