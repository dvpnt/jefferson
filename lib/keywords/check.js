'use strict';

var _ = require('underscore');

module.exports = function(validator) {
	validator._ajv.addKeyword('check', {
		validate: validate,
		errors: true
	});

	function validate(check, value, parentSchema, path, parent, propertyName) {
		if (!_(check).isFunction()) {
			validate.errors = [{
				keyword: 'check',
				params: {check: 'check'},
				message: 'check must be a function'
			}];
			return false;
		}

		var result = check(value, parent, propertyName);

		if (_(result).isBoolean()) {
			return result;
		} else if (_(result).isString()) {
			validate.errors = [{
				keyword: 'check',
				params: {propertyName: propertyName, value: value},
				message: result
			}];
			return false;
		} else {
			return false;
		}
	}
};
