REPORTER?=spec

test:
	@./node_modules/.bin/mocha -R $(REPORTER) test/*.js test/**/*.js
	
test-cov:
	@./node_modules/.bin/jscoverage lib lib-cov
	@AUTHOM_COV=TRUE REPORTER=html-cov $(MAKE) test > coverage.html
	@rm -r lib-cov

.PHONY: test test-cov