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

### Lang
* `(if (cond) (first-expr) (second-expr))`: evaluates `first-expr` if `cond` evaluates to `true`, otherwise evaluates `second-expr`
* `(quote (expr))`: returns expression `expr` without evluation
* `(eval (expr))`: explicitly evaluates `expr`
* `(define (symbol) (expr))`: assigns `expr` to `symbol`
* `(lambda (arg-symbols) (body-expr))`: creates anonymous function with arguments `arg-symbols` and function body `body-expr`
* `(cond ((condition) (expr)) ((condition) (expr)) (else (expr)))`: evaluates `expr` if related `condition` evaluates to `true`, `else` is optional if no `condition` evaluated to `true`

### Pair
* `(cons (expr) (expr))`: creates pair of both expressions `expr`
* `(car (expr))`: evaluates to the first value of a pair
* `(cdr (expr))`: evaluates to the second value of a pair

### Arithmetic
* `(plus (first-expr) (second-expr) … (nth-expr))`: evaluates to the sum of all expressions
* `(minus (first-expr) (second-expr) … (nth-expr))`: evaluates to the substraction of all expressions
* `(multiply (first-expr) (second-expr) … (nth-expr))`: evaluates to the arithmetic product of all expressosions
* `(divide (first-expr) (second-expr) … (nth-expr))`: evaluates to the quotient of all expressions

		Both, floating point and integer numbers, may be used.

### Logical

* `(and (first-expr) (second-expr) … (nth-expr))`: evaluates to the conjuntion of all expressions
* `(or (first-expr) (second-expr) … (nth-expr))`: evaluates to the disjunction of all expressions
* `(not (expr))`: evaluates to the logical inversion of `expr`
* `(xor (first-expr) (second-expr))`: evaluates to XOR of both expressions

### Comparison
* `(equals (expr) (expr))`: evaluates to `true` if both `expr` evaluate to the same result
* `(greaterthan (expr) (expr))`: evaluates to `0` if both `expr` evaluate to the same result, to `1` if the first `expr` is greater than the second `expr`, to `-1` if the second `expr` is greater

### Reflection
* `(pair? (expr))`: evaluates to `true` if `expr` is a pair, otherwise to `false`
* `(symbol? (expr))`: evaluates to `true` if `expr` is a symbol, otherwise to `false`
* `(number? (expr))`: evaluates to `true` if `expr` is a number, otherwise to `false`
* `(string? (expr))`: evaluates to `true` if `expr` is a string, otherwise to `false`
* `(nil? (expr))`: evaluates to `true` if `expr` is nil, otherwise to `false`




