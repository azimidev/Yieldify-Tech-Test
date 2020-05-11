let assert = require('assert');
let Vector2D = require('../src/js/vector2d.js');
let Ball = require('../src/js/Ball.js');

describe('Ball', () => {
	let dimension = {
		width: 100,
		height: 100 * (2 / 3),
	};

	let radius = 1;

	// Machine epsilon (an upper bound on the relative error due to rounding in floating point arithmetic)
	let epsilon = 0.00000001;

	function nearEqual(a, b) {
		return Math.abs(a - b) < epsilon;
	}
	describe('no collision', () => {
		it('should have the same position before and after method', () => {
			// arrange
			let oldPositionA = new Vector2D(50, 50);
			let a = new Ball.VerticalBall(
				oldPositionA.clone(),
				new Vector2D(10, 0),
				radius,
				dimension
			);
			let oldPositionB = new Vector2D(60, 50);
			let b = new Ball.VerticalBall(
				oldPositionB.clone(),
				new Vector2D(10, 0),
				radius,
				dimension
			);

			// act
			a.collision(b);

			// assert
			assert(a.position.X === oldPositionA.X);
			assert(a.position.Y === oldPositionA.Y);
			assert(b.position.X === oldPositionB.X);
			assert(b.position.Y === oldPositionB.Y);
		});
	});
	describe('1 moving ball collision', () => {
		it('should move the stationary ball and stop the moving ball', () => {
			// arrange
			let oldPositionA = new Vector2D(50, 50);
			let a = new Ball.VerticalBall(
				oldPositionA.clone(),
				new Vector2D(10, 0),
				radius,
				dimension
			);
			let oldVelocityA = a.velocity.clone();
			let oldPositionB = new Vector2D(50.5, 50);
			let b = new Ball.VerticalBall(
				oldPositionB.clone(),
				new Vector2D(0, 0),
				radius,
				dimension
			);
			let oldVelocityB = b.velocity.clone();

			// act
			a.collision(b);

			// assert
			assert(nearEqual(a.position.X, oldPositionA.X) === true);
			assert(nearEqual(a.position.Y, oldPositionA.Y) === true);
			assert(nearEqual(a.velocity.X, oldVelocityB.X) === true);
			assert(nearEqual(a.velocity.Y, oldVelocityB.Y) === true);
			assert(nearEqual(b.position.X, oldPositionB.X) === false);
			assert(nearEqual(b.position.Y, oldPositionB.Y) === true);
			assert(nearEqual(b.velocity.X, oldVelocityA.X) === true);
			assert(nearEqual(b.velocity.Y, oldVelocityA.Y) === true);
		});
	});
	describe('2 moving balls collision', () => {
		it('should change the velocity vectors of both balls', () => {
			// arrange
			let oldPositionA = new Vector2D(50, 50);
			let a = new Ball.VerticalBall(
				oldPositionA.clone(),
				new Vector2D(10, 0),
				radius,
				dimension
			);
			let oldVelocityA = a.velocity.clone();
			let oldPositionB = new Vector2D(50.5, 50);
			let b = new Ball.VerticalBall(
				oldPositionB.clone(),
				new Vector2D(-7, 0),
				radius,
				dimension
			);
			let oldVelocityB = b.velocity.clone();

			// act
			a.collision(b);

			// assert
			assert(nearEqual(a.position.X, oldPositionA.X) === false);
			assert(nearEqual(a.position.Y, oldPositionA.Y) === true);
			assert(nearEqual(a.velocity.X, oldVelocityB.X) === true);
			assert(nearEqual(a.velocity.Y, oldVelocityB.Y) === true);
			assert(nearEqual(b.position.X, oldPositionB.X) === false);
			assert(nearEqual(b.position.Y, oldPositionB.Y) === true);
			assert(nearEqual(b.velocity.X, oldVelocityA.X) === true);
			assert(nearEqual(b.velocity.Y, oldVelocityA.Y) === true);
		});
	});
});
