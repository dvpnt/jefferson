'use strict';

var inherits = require('util').inherits;

var ValidationError = function(params) {
	this.message = params.message;
	Error.captureStackTrace(this, this.constructor);
};
inherits(ValidationError, Error);

exports.ValidationError = ValidationError;
