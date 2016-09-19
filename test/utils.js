'use strict';

var utils = require('../lib/utils'),
	expect = require('expect.js');

describe('utils', function() {
	describe('requiredNormalize', function() {
		it('should normalize required to v4 draft', function() {
			var schema = {
				properties: {
					x: {required: true},
					y: {
						properties: {
							z: {required: true},
							i: {
								properties: {
									j: {required: true},
									k: {required: true}
								},
								required: ['q', 'w']
							}
						}
					},
					a: {required: true},
					b: {required: false}
				}
			};

			utils.requiredNormalize(schema);

			expect(schema).to.eql({
				properties: {
					x: {},
					y: {
						properties: {
							z: {},
							i: {
								properties: {
									j: {},
									k: {}
								},
								required: ['q', 'w', 'j', 'k']
							}
						},
						required: ['z']
					},
					a: {},
					b: {}
				},
				required: ['x', 'a']
			})
		});
	});
});
