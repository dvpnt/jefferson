'use strict';

var jefferson = require('../'),
	expect = require('expect.js');

describe('format', function() {
	it('should throw error if add existing format', function() {
		expect(function() {
			jefferson.addFormat('hostname', /.*/);
		}).to.throwError(/format `hostname` already exists/);
	});

	it('should add format', function() {
		jefferson.addFormat('md5', /^[0-9a-f]{32}$/);
	});

	it('should be ok with added format', function() {
		jefferson.validate({format: 'md5'}, 'deadbeefdeadbeefdeadbeefdeadbeef');
	});

	it('should throw error on error', function() {
		expect(function() {
			jefferson.validate({format: 'md5'}, 'haha');
		}).to.throwError(/should match format "md5"/);
	});
});
