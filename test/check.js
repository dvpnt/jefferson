'use strict';

var jefferson = require('../'),
	expect = require('expect.js');

describe('check', function() {
	beforeEach(function() {
		jefferson._ajv._cache.clear();
	});

	it('should throw error if is not a function', function() {
		expect(function() {
			jefferson.validate({check: 'foo'}, 'bar');
		}).to.throwError(/check must be a function/);
	});

	it('should throw error if return false', function() {
		expect(function() {
			jefferson.validate({
				check: function() {return false;}
			}, 'bar');
		}).to.throwError(/should pass "check" keyword validation/);
	});

	it('should throw error if return string', function() {
		expect(function() {
			jefferson.validate({
				check: function() {return 'check error';}
			}, 'bar');
		}).to.throwError(/check error/);
	});

	it('should be ok if return true', function() {
		jefferson.validate({
			check: function() {return true;}
		}, 'bar');
	});

	it('should throw error if return any other type', function() {
		expect(function() {
			jefferson.validate({
				check: function() {return 5;}
			}, 'bar');
		}).to.throwError(/should pass "check" keyword validation/);
	});

	it('should be called with correct arguments for scalar', function() {
		jefferson.validate({
			check: function(value, parent, propertyName) {
				expect(value).to.eql('bar');
				expect(parent).not.ok();
				expect(propertyName).not.ok();
				return true;
			}
		}, 'bar');
	});

	it('should be called with correct arguments for object', function() {
		jefferson.validate({
			properties: {
				foo: {
					type: 'string',
					check: function(value, parent, propertyName) {
						expect(value).to.eql('bar');
						expect(parent).to.eql({foo: 'bar'});
						expect(propertyName).to.eql('foo');
						return true;
					}
				}
			}
		}, {foo: 'bar'});
	});
});
