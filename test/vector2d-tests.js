let assert = require('assert');
let Vector2D = require('../src/js/vector2d.js');

describe('Vector2D', () => {
	describe('empty vector constructor', () => {
		it('should return vector with undefined X and Y coordinates', () => {
			let vector = new Vector2D();
			assert(typeof vector.X === 'undefined');
			assert(typeof vector.Y === 'undefined');
		});
	});
	describe('vector constructor', () => {
		it('should return vector with defined X and Y coordinates', () => {
			let X = 2;
			let Y = 3;
			let vector = new Vector2D(X, Y);
			assert(vector.X === X);
			assert(vector.Y === Y);
		});
	});
	describe('zero vector', () => {
		it('should return vector with X and Y to 0', () => {
			let vector = Vector2D.zero();
			assert(vector.X === 0);
			assert(vector.Y === 0);
		});
	});
	describe('clone vector', () => {
		it('should return vector with coordinates but different reference', () => {
			let X = 5;
			let Y = 1;
			let vector = new Vector2D(X, Y);
			let clone = vector.clone();
			assert(clone.X === X);
			assert(clone.Y === Y);
			assert((vector === clone) === false);
		});
	});
	describe('vector length', () => {
		it('should return 1 because all 4 combinations are unit vectors', () => {
			assert(new Vector2D(1, 0).length() === 1); // X axis positive
			assert(new Vector2D(-1, 0).length() === 1); // X axis negative
			assert(new Vector2D(0, 1).length() === 1); // Y axis positive
			assert(new Vector2D(0, -1).length() === 1); // Y axis negative
		});
	});
	describe('normalize vector', () => {
		it('should return 1 or -1 because all 4 combinations are axis vectors', () => {
			assert(new Vector2D(5, 0).tryNormalize().X === 1); // X axis positive
			assert(new Vector2D(-8, 0).tryNormalize().X === -1); // X axis negative
			assert(new Vector2D(0, 12).tryNormalize().Y === 1); // Y axis positive
			assert(new Vector2D(0, -1).tryNormalize().Y === -1); // Y axis negative
		});
	});
	describe('vector angle ', () => {
		it('should return the same value because the pairs have same unit vector and all 4 combinations are axis vectors', () => {
			assert(new Vector2D(12, 0).angle() === new Vector2D(17, 0).angle()); // X axis positive
			assert(
				new Vector2D(-31, 0).angle() === new Vector2D(-4, 0).angle()
			); // X axis negative
			assert(new Vector2D(0, 12).angle() === new Vector2D(0, 3).angle()); // Y axis positive
			assert(
				new Vector2D(0, -1).angle() === new Vector2D(0, -45).angle()
			); // Y axis negative
		});
	});
	describe('is near zero vector', () => {
		it('should return true if the abs of the nonzero constant is smaller than NEAR_ZERO', () => {
			assert(new Vector2D(0.009, 0).isNearZero() === true);
			assert(new Vector2D(-0.005, 0).isNearZero() === true);
			assert(new Vector2D(0.02, 0).isNearZero() === false);
			assert(new Vector2D(-0.011, 0).isNearZero() === false);
			assert(new Vector2D(0, 0.0003).isNearZero() === true);
			assert(new Vector2D(0, -0.00999).isNearZero() === true);
			assert(new Vector2D(0, 0.01111).isNearZero() === false);
			assert(new Vector2D(0, -0.02).isNearZero() === false);
		});
	});
});
