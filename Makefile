test:
	@find test/*.js | xargs -n 1 -t vows

lint:
	@find lib/*.js | xargs -n 1 -t nodelint --config nodelintconfig.js

.PHONY: test lint
