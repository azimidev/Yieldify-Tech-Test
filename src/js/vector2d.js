/**
 * This file is taken from common GitHub Gist and modified.
 */
(function () {
	'use strict';

	function Vector2D(x, y) {
		this.X = x;
		this.Y = y;
	}

	Vector2D.prototype.length = function () {
		return Math.sqrt(this.X * this.X + this.Y * this.Y);
	};

	Vector2D.prototype.distance = function (v) {
		return this.sub(v).length();
	};

	Vector2D.prototype.angle = function () {
		return Math.atan2(this.X, this.Y);
	};

	Vector2D.prototype.tryNormalize = function () {
		let length = this.length();
		return length === 0 ? Vector2D.zero() : this.div(length);
	};

	Vector2D.prototype.convertToLocal = function (dimensions) {
		return new Vector2D(
			this.X - dimensions.left,
			this.Y - dimensions.top
		).div(dimensions.scaleRatio);
	};

	Vector2D.prototype.mult = function (factor) {
		return new Vector2D(this.X * factor, this.Y * factor);
	};

	Vector2D.prototype.div = function (factor) {
		return new Vector2D(this.X / factor, this.Y / factor);
	};

	Vector2D.prototype.add = function (v) {
		return new Vector2D(v.X + this.X, v.Y + this.Y);
	};

	Vector2D.prototype.sub = function (v) {
		return new Vector2D(this.X - v.X, this.Y - v.Y);
	};

	Vector2D.prototype.dot = function (v) {
		return this.X * v.X + this.Y * v.Y;
	};

	Vector2D.prototype.opposite = function () {
		return new Vector2D(-this.X, -this.Y);
	};

	Vector2D.prototype.direction = function (v) {
		return v.sub(this);
	};

	Vector2D.prototype.isZero = function () {
		return this.X === 0 && this.Y === 0;
	};

	Vector2D.prototype.isNearZero = function () {
		return this.length() < Vector2D.NEAR_ZERO;
	};

	Vector2D.prototype.isUndefined = function () {
		return typeof this.X == 'undefined' || typeof this.Y == 'undefined';
	};

	Vector2D.prototype.clone = function () {
		return new Vector2D(this.X, this.Y);
	};

	Vector2D.zero = function () {
		return new Vector2D(0, 0);
	};

	Vector2D.random = function () {
		return new Vector2D(Math.random(), Math.random());
	};

	// abs of the nonzero constant
	Vector2D.NEAR_ZERO = 0.01;

	let root =
		(typeof self == 'object' && self.self === self && self) ||
		(typeof global == 'object' && global.global === global && global) ||
		this ||
		{};

	if (typeof exports != 'undefined' && !exports.nodeType) {
		if (
			typeof module != 'undefined' &&
			!module.nodeType &&
			module.exports
		) {
			exports = module.exports = Vector2D;
		}
		exports.Vector2D = Vector2D;
	} else {
		root.Vector2D = Vector2D;
	}
})();
