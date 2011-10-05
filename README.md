# Ballz.js - a small Node.js based LISP interpreter

## Installing Ballz



## Running Ballz REPL
  	node bin/ballz-repl.js
or
  	./bin/ballz-repl.js
## Running Ballz Web-REPL
  	node bin/ballz-web-repl/ballz-web-repl.js
or
  	./bin/ballz-web-repl/ballz-web-repl.js
## Running tests

To run our unit tests, you need to install the development dependencies:

    npm install . # in your ballz.js directory

After all dependencies are installed, run `make test`.

## Features

###Lang
* if
* quote
* eval
* define
* lambda
* cond

###Pair
* cons
* car
* cdr

###Arithmetic
* plus
* minus
* divide
* multiply

###Logical
* and
* or
* not
* xor

###Comparison
* equals
* greaterthan

###Reflection
* pair?
* lambda?
* symbol?
* number?
* string?
* nil?



