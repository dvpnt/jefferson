'use strict';

var _ = require('underscore');

module.exports = function(validator) {
	validator._ajv.addKeyword('modify', {
		validate: validate,
		errors: true
	});

	function validate(modifier, value, parentSchema, path, parent, propertyName) {
		if (!parent) {
			validate.errors = [{
				keyword: 'modify',
				params: {path: path, value: value},
				message: 'modify support only object properties'
			}];
			return false;
		}

		if (_(modifier).isFunction()) {
			parent[propertyName] = modifier(parent[propertyName]);
			return true;
		} else if (_(modifier).isString()) {
			if (!validator._modifiers[modifier]) {
				validate.errors = [{
					keyword: 'modify',
					params: {modifier: modifier},
					message: 'unknown modifier'
				}];
				return false;
			}
			parent[propertyName] = validator._modifiers[modifier](
				parent[propertyName]
			);
			return true;
		} else {
			validate.errors = [{
				keyword: 'modify',
				params: {modifier: modifier},
				message: 'modifier must be string or function'
			}];
			return false;
		}
	}
};
