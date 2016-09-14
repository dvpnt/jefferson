'use strict';

var jefferson = require('../'),
	expect = require('expect.js');

describe('format', function() {
	it('should throw error if add existing format', function() {
		expect(function() {
			jefferson.addFormat('hostname', /.*/);
		}).to.throwError(/format `hostname` already exists/);
	});
});
