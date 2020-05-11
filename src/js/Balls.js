(function () {
	'use strict';

	/*****************************************************************
	 ** CONSTANTS                                                   **
	 *****************************************************************/
	let fps = 60; // Note: if you change this, you'll need to adopt gravity and resistance logic in ball.js
	let intervalMs = 1000 / fps;
	let localDimensions = {
		width: 100, // 1 localDimensions.width is 1 local unit
		height: 100 * (2 / 3), // the canvas ratio is always 3:2
	};
	let ballInfo = {
		radius: 1.5, // local units
		startAngle: 0,
		endAngle: 2 * Math.PI,
		color: '#000',
	};

	/*****************************************************************
	 ** OBJECT PROPERTIES, GLOBAL VARIABLES USED BETWEEN FUNCTIONS  **
	 *****************************************************************/
	let updateInterval,
		canvas,
		context,
		dimension,
		aim,
		balls,
		ballType,
		mousePosition,
		newBallPosition,
		newBallDirection;

	/**
	 * Get canvas dimension.
	 * @returns {{scaleRatio : number, top : number, left : number, width : number, height : number}}
	 */
	function getCanvasDimensions() {
		return {
			width: dimension.offsetWidth,
			height: dimension.offsetHeight,
			top: dimension.offsetTop,
			left: dimension.offsetLeft,
			scaleRatio: dimension.offsetWidth / localDimensions.width,
		};
	}

	function addNewBall() {
		aim = false;

		// save the new ball
		const newBall = new ballType(
			newBallPosition.clone(),
			newBallDirection.clone(),
			ballInfo.radius,
			localDimensions
		);
		// push it to the balls array
		balls.push(newBall);

		// reset values
		newBallDirection = Vector2D.zero();
		newBallPosition = new Vector2D();
	}

	/**
	 * Draw ball.
	 *
	 * @param ballCoords
	 * @param scaleRatio
	 */
	function drawBall(ballCoords, scaleRatio) {
		// convert the coordinates in CANVAS size
		let scaledCoords = ballCoords.mult(scaleRatio);

		// Canvas method
		context.beginPath();
		context.arc(
			scaledCoords.X,
			scaledCoords.Y,
			// convert the radius too
			ballInfo.radius * scaleRatio,
			ballInfo.startAngle,
			ballInfo.endAngle
		);
		context.closePath();

		context.fillStyle = ballInfo.color;
		context.fill();
	}

	/**
	 * On mouse move event.
	 * @param event
	 */
	function onMouseMove(event) {
		if (aim) {
			// convert mouse coordinates to local coordinates
			let dimensions = getCanvasDimensions();
			mousePosition = new Vector2D(
				event.pageX,
				event.pageY
			).convertToLocal(dimensions);

			if (newBallPosition.isUndefined()) {
				newBallPosition = mousePosition.clone();
			}

			// check where the pointer is located
			// if you didn't move the mouse
			if (
				mousePosition.X <= 0 ||
				mousePosition.X >= localDimensions.width ||
				mousePosition.Y <= 0 ||
				mousePosition.Y >= localDimensions.height
			) {
				addNewBall();
			} else {
				// calculate aim direction
				newBallDirection = mousePosition.direction(newBallPosition);
			}
		}
	}

	/**
	 * Mouse down.
	 * Calculate the start position.
	 * @param event
	 */
	function onMouseDown(event) {
		aim = true;
		onMouseMove(event);
	}

	/**
	 * Main function.
	 */
	function update() {
		// check dimensions and clear canvas
		// the canvas is cleared when a new value is attached to dimensions (no matter if a same value)
		let dimensions = getCanvasDimensions();
		canvas.width = dimensions.width;
		canvas.height = dimensions.height;

		// aiming mode
		if (aim) {
			// draw new ball
			drawBall(newBallPosition, dimensions.scaleRatio);
		}

		// update ball position & velocity
		for (let i = 0; i < balls.length; i++) {
			balls[i].move();
		}

		// draw updated balls
		for (let i = 0; i < balls.length; i++) {
			drawBall(balls[i].position, dimensions.scaleRatio);
		}
	}

	/**
	 * Public init function.
	 * @param canvasId
	 * @param dimensionsId
	 */
	function init(canvasId, dimensionsId) {
		// Get the canvas from the DOM
		canvas = document.getElementById(canvasId);
		// Initialise the canvas
		context = canvas.getContext('2d');
		// Get the canvas dimension from the DOM
		dimension = document.getElementById(dimensionsId);
		// X & Y should be represented with local coordinates
		mousePosition = new Vector2D();
		newBallPosition = new Vector2D();
		newBallDirection = Vector2D.zero();
		ballType = window.Balls.VerticalBall;
		balls = [];

		// add mouse event listeners
		canvas.addEventListener('mouseup', addNewBall);
		document.addEventListener('mousemove', onMouseMove);
		canvas.addEventListener('mousedown', onMouseDown);

		// set interval
		updateInterval = setInterval(update, intervalMs);
	}

	/**
	 * Start the app somewhere else.
	 * @type {{init : init}}
	 */
	window.Start = { init };
})();
