test:
	@find test/*.js | xargs -n 1 -t node_modules/vows/bin/vows
lint:
	@find lib/*.js | xargs -n 1 -t node_modules/nodelint/nodelint --config nodelintconfig.js

.PHONY: test lint
