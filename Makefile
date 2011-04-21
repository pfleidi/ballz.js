test:
	@find test/*.js | xargs -n 1 -t expresso

lint:
	@find lib/*.js | xargs -n 1 -t nodelint --config nodelintconfig.js

.PHONY: test lint
