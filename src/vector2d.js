/**
 * Vector2D class.
 * This file is taken from common GitHub Gist and modified.
 * Some of the methods are only used for tests.
 * I have written this class with ES6 first and then I compiled it to ES5
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
})();
