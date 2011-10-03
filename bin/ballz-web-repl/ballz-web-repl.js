#!/usr/bin/env node

var http = require('http'),
    io = require('socket.io'),
    sys = require('sys'),
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    eyes = require('eyes');

var Parser = require('../../lib/parser');
var Environment = require('../../lib/environment');
var interpreter = require('../../lib/interpreter').createInterpreter(
  Environment.createEnvironment()
);


server = http.createServer(function(req, res){
      fs.readFile('client.html', "binary", function(err, file) {
        if(err) {
          res.writeHead(500, {"Content-Type": "text/plain"});
          res.write(err + "\n");
          res.end();
          return;
        }

        res.writeHead(200);
        res.write(file, "binary");
        res.end();
      });
});
server.listen(8080);

// socket.io
var io = io.listen(server);

function exec(cmd) {
  var ast = Parser.parse(cmd);
  var eval = interpreter.eval(ast);
  sys.puts(eval);
  return eval;
}

io.sockets.on('connection', function (socket) {
    socket.on('eval', function (data) {
      try {
        socket.emit('result', {result : exec(data.lisp)});
      } catch (e) {
        socket.emit('error',{ error: e.message+'\n'+e.stack});
      }
    });
});
