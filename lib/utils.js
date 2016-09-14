'use strict';

var _ = require('underscore');

var requiredNormalize = function(schema) {
	if (!schema.properties) return;

	if (!_(schema.required).isArray()) {
		schema.required = [];
	}

	_(schema.properties).each(function(sub, propertyName) {
		if (_(sub.required).isBoolean()) {
			if (sub.required) {
				schema.required.push(propertyName);
			}
			delete sub.required;
		}

		requiredNormalize(sub);
	});

	if (schema.required.length === 0) {
		delete schema.required;
	}
};

exports.requiredNormalize = requiredNormalize;
