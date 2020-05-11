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
});
