'use strict';

var _ = require('underscore'),
	Ajv = require('ajv'),
	utils = require('./utils'),
	keywords = require('./keywords'),
	ValidationError = require('./errors').ValidationError;

var Validator = function(options) {
	options = _(options || {}).defaults({
		coerceTypes: true,
		useDefaults: true,
		v3required: true,
		throwError: true
	});

	var self = this;

	self._options = options;

	self._ajv = new Ajv(_(options).pick(
		'coerceTypes',
		'useDefaults'
	));

	self._modifiers = {};

	_(keywords).each(function(keyword) {
		keyword(self);
	});
};

Validator.prototype.validate = function(schema, value) {
	if (this._options.v3required) {
		utils.requiredNormalize(schema);
	}

	var result = this._ajv.validate(schema, value);

	if (!result && this._options.throwError) {
		throw new ValidationError(this._ajv.errors[0]);
	} else {
		return {
			valid: result,
			errors: this._ajv.errors
		};
	}
};

Validator.prototype.addFormat = function(name, format) {
	if (this._ajv._formats[name]) {
		throw new Error('format `' + name + '` already exists');
	}

	this._ajv.addFormat.call(this._ajv, name, format);
};

Validator.prototype.addModifier = function(name, modifier) {
	if (this._modifiers[name]) {
		throw new Error('modifier `' + name + '` already exists');
	}

	this._modifiers[name] = modifier;
};

module.exports = new Validator();
module.exports.Validator = Validator;
