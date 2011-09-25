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

    var uri = url.parse(req.url).pathname,
        filename = path.join(process.cwd(), uri);

    path.exists(filename, function(exists) {
      if(!exists) {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.write("404 Not Found\n");
        res.end();
        return;
      }

      if(fs.statSync(filename).isDirectory()) {
        filename = "client.html";
      }

      fs.readFile(filename, "binary", function(err, file) {
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
});
server.listen(8080);

// socket.io
var io = io.listen(server);

function exec(cmd) {
  var ast = Parser.parse(cmd);
  return interpreter.eval(ast);
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
