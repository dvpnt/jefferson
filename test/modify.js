'use strict';

var jefferson = require('../'),
	expect = require('expect.js');

describe('modify', function() {
	beforeEach(function() {
		jefferson._ajv._cache.clear();
	});

	it('should add modifier', function() {
		jefferson.addModifier('plus10', function(value) {
			return value + 10;
		});
	});

	it('should throw error if add existing modfier', function() {
		expect(function() {
			jefferson.addModifier('plus10', function() {});
		}).to.throwError(/modifier `plus10` already exists/);
	});

	it('should throw error if modify scalar', function() {
		expect(function() {
			jefferson.validate({modify: 'plus10'}, 'bar');
		}).to.throwError(/modify support only object properties/);
	});

	it('should be called with correct arguments', function() {
		var called;
		jefferson.validate({
			properties: {
				foo: {
					type: 'integer',
					modify: function(value) {
						expect(value).to.eql(100);
						called = true;
					}
				}
			}
		}, {foo: 100});
		expect(called).to.be.ok();
	});

	it('should throw error on unexisting modifier', function() {
		expect(function() {
			jefferson.validate({
				properties: {
					foo: {
						type: 'integer',
						modify: 'plus777'
					}
				}
			}, {foo: 100});
		}).to.throwError(/unknown modifier/);
	});

	it('should be ok with added modifier', function() {
		var value = {foo: 100};
		jefferson.validate({
			properties: {
				foo: {
					type: 'integer',
					modify: 'plus10'
				}
			}
		}, value);
		expect(value).to.eql({foo: 110});
	});

	it('should be ok with inline modifier', function() {
		var value = {foo: 100};
		jefferson.validate({
			properties: {
				foo: {
					type: 'integer',
					modify: function(value) {return value + 100;}
				}
			}
		}, value);
		expect(value).to.eql({foo: 200});
	});

	it('should throw error bad modifier', function() {
		expect(function() {
			jefferson.validate({
				properties: {
					foo: {
						type: 'integer',
						modify: 100
					}
				}
			}, {foo: 100});
		}).to.throwError(/modifier must be string or function/);
	});
});
