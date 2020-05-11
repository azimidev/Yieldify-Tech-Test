/**
 * Balls.js
 *
 * Some of the functionalities are taken from a GitHub Gist
 */
(function () {
	"use strict";

	/**
	 * Balls class.
	 * @param position
	 * @param velocity
	 * @param radius
	 * @param localDimensions
	 * @constructor
	 */
	function Ball(position, velocity, radius, localDimensions) {
		// base constructor
		this.position = position;
		this.velocity = velocity;
		this.radius = radius;
		this._borderCoords = {
			top: radius,
			bottom: localDimensions.height - radius,
			left: radius,
			right: localDimensions.width - radius,
		};
	}

	Ball.prototype.collision = function (ball) {
		let minDistance = ball.radius + this.radius;
		let positionSub = this.position.sub(ball.position);
		let distance = positionSub.length();

		if (distance <= minDistance) {
			if (distance !== 0) {
				let coeff =
					this.velocity.sub(ball.velocity).dot(positionSub) /
					(distance * distance);
				this.velocity = this.velocity.sub(positionSub.mult(coeff));
				ball.velocity = ball.velocity.sub(
					positionSub.opposite().mult(coeff)
				);
			}

			// apply a random vector if both velocities are zero vectors
			let applyRandomVector =
				this.velocity.isZero() && ball.velocity.isZero();
			if (applyRandomVector) {
				this.velocity = Vector2D.random();
				ball.velocity = this.velocity.opposite();
			}

			// move balls outside of collision
			let diff = (minDistance - distance) / 2 + 0.001; // add a very small value so they won't touch
			this.position = this.position.add(
				this.velocity.tryNormalize().mult(diff)
			);
			ball.position = ball.position.add(
				ball.velocity.tryNormalize().mult(diff)
			);

			// if a random vector is applied revert the zero vectors
			if (applyRandomVector) {
				this.velocity = Vector2D.zero();
				ball.velocity = Vector2D.zero();
			}
		}
	};

	/**
	 * Vertical ball class.
	 * @type {{airResistance : number, gravity : number, rollingResistance : number, hitResistance : number, velocityFactor : number}}
	 */
	let verticalMovementProperties = {
		airResistance: 0.995, // slows down the speed in each frame
		hitResistance: 0.8, // slows down the Y speed when the surface is hitted
		rollingResistance: 0.98, // slows down the X speed when rolling on the ground
		gravity: 0.05, // pulls the ball to the ground in each frame
		velocityFactor: 0.07, // velocity factor (converts vector from the mouse dragging to this environment)
	};

	function VerticalBall(position, velocity, radius, localDimensions) {
		// VerticalBall constructor
		// call the base constructor
		Ball.call(
			this,
			position,
			velocity.mult(verticalMovementProperties.velocityFactor),
			radius,
			localDimensions
		);
	}

	// VerticalBall inherits from the Ball class
	VerticalBall.prototype = Object.create(Ball.prototype);
	VerticalBall.prototype.constructor = VerticalBall; // keep the constructor

	VerticalBall.prototype.move = function () {
		if (
			this.velocity.isNearZero() &&
			this.position.Y === this._borderCoords.bottom &&
			!this.velocity.isZero()
		)
			this.velocity = Vector2D.zero(); // the ball is staying in place

		// move the ball using the velocity
		this.position = this.position.add(this.velocity);

		if (
			this.position.X <= this._borderCoords.left ||
			this.position.X >= this._borderCoords.right
		) {
			// move ball inside the borders
			this.position.X =
				this.position.X <= this._borderCoords.left
					? this._borderCoords.left
					: this._borderCoords.right;

			// reflection
			this.velocity.X = -this.velocity.X;
		}
		if (
			this.position.Y <= this._borderCoords.top ||
			this.position.Y >= this._borderCoords.bottom
		) {
			// move ball inside the borders
			this.position.Y =
				this.position.Y <= this._borderCoords.top
					? this._borderCoords.top
					: this._borderCoords.bottom;

			if (this.position.Y === this._borderCoords.bottom) {
				// when ball is on the ground, update resistances
				this.velocity.Y *= verticalMovementProperties.hitResistance;
				this.velocity.X *= verticalMovementProperties.rollingResistance;
			}

			// reflection
			this.velocity.Y = -this.velocity.Y;
		}

		// apply air resistance
		this.velocity = this.velocity.mult(
			verticalMovementProperties.airResistance
		);

		if (
			this.position.Y === this._borderCoords.bottom &&
			Math.abs(this.velocity.Y) <= Vector2D.NEAR_ZERO
		)
			// the ball isn't falling or jumping
			this.velocity.Y = 0;
		// apply gravity if falling or jumping
		else this.velocity.Y += verticalMovementProperties.gravity;
	};

	/* Save these classes as global */
	var Balls = {
		VerticalBall,
	};
	// Establish the root object, `window` (`self`) in the browser, `global`
	// on the server, or `this` in some virtual machines.
	var root =
		(typeof self == "object" && self.self === self && self) ||
		(typeof global == "object" && global.global === global && global) ||
		this ||
		{};

	// Export the Balls object for **Node.js**, with
	// backwards-compatibility for their old module API. If we're in
	// the browser, add Balls as a global object.
	// (`nodeType` is checked to ensure that `module`
	// and `exports` are not HTML elements.)
	if (typeof exports != "undefined" && !exports.nodeType) {
		if (
			typeof module != "undefined" &&
			!module.nodeType &&
			module.exports
		) {
			exports = module.exports = Balls;
		}
		exports.Balls = Balls;
	} else {
		root.Balls = Balls;
	}
})();
