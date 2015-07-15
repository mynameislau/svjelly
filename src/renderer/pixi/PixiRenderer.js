var Commands = require('../../core/Commands');
var CIRCLE = Commands.CIRCLE;
var LINE_TO = Commands.LINE_TO;
var MOVE_TO = Commands.MOVE_TO;
var BEZIER_TO = Commands.BEZIER_TO;
var QUADRA_TO = Commands.QUADRA_TO;
var ELLIPSE = Commands.ELLIPSE;
var SVJellyUtils = require('../../core/SVJellyUtils');
var twoPIS = Math.PI * 2;
var PIXI = window.PIXI;

var PixiRenderer =
{
	create: function ($world, $container)
	{
		var inst = Object.create(PixiRenderer);

		inst.container = $container;
		inst.world = $world;
		inst.debug = $world.conf.debug;

		return inst;
	},

	setSize: function ($width, $height)
	{
		while (this.container.firstChild)
		{
			this.container.removeChild(this.container.firstChild);
		}

		this.staticGraphics = [];
		this.dynamicGraphics = [];
		this.canvases = [];
		this.layers = [];
		this.canvasesLength = 0;
		this.cachedHard = [];
		this.dynamicGroups = [];
		this.staticGroups = [];
		this.dynamicGroupsLength = undefined;

		this.width = $width;
		this.height = $height;

		console.log(PIXI);
		this.renderer = new PIXI.WebGLRenderer(this.width, this.height, {
			antialias: false
		});
		this.container.appendChild(this.renderer.view);
		this.stage = new PIXI.Container();
		this.viewPortContainer = new PIXI.Container();
		this.mainPixiContainer = new PIXI.Container();
		this.stage.addChild(this.viewPortContainer);
		this.viewPortContainer.addChild(this.mainPixiContainer);

		this.ratio = this.world.getWidth() / this.width;

		this.previousViewCenter = [null, null];
		this.viewCenter = [0, 0];
		this.viewportScale = undefined;
		this.previousViewportScale = undefined;

		this.scaleX = this.scaleY = 100;//1 / this.ratio;

		//creating drawing groups
		this.drawingGroups = [];
		var k = 0;
		var i;
		for (var groupsLength = this.world.drawings.length; k < groupsLength; k += 1)
		{
			var currDrawing = this.world.drawings[k];
			currDrawing.setScale(this.scaleX, this.scaleY);
			this.createDrawingGroup(currDrawing);
		}
		this.drawingGroupsLength = this.drawingGroups.length;

		var drawingGroup;

		//creating canvas and caching non moving groups
		i = 0;
		var graphics;
		for (i; i < this.drawingGroupsLength; i += 1)
		{
			drawingGroup = this.drawingGroups[i];
			if (drawingGroup.isStatic)
			{
				graphics = this.staticGraphics[i - 1] || this.createGraphics();
				this.staticGraphics[i] = graphics;
				this.staticGroups.push(drawingGroup);
			}
			else
			{
				graphics = this.dynamicGraphics[i - 1] || this.createGraphics();
				this.dynamicGraphics[i] = graphics;
				this.dynamicGroups.push(drawingGroup);
			}
			drawingGroup.graphics = graphics;
		}
		this.dynamicGroupsLength = this.dynamicGroups.length;
		this.staticGroupsLength = this.staticGroups.length;
		//

		//caching gradients and precalculating
		for (i = 0; i < this.drawingGroupsLength; i += 1)
		{
			drawingGroup = this.drawingGroups[i];
			this.precalculating(drawingGroup);
			drawingGroup.objectDrawingsLength = drawingGroup.objectDrawings.length;
			//
			if (drawingGroup.properties.strokeGradient)
			{
				drawingGroup.properties.stroke = 0xFF00FF;//this.createGradient(drawingGroup, drawingGroup.properties.strokeGradient);
			}
			if (drawingGroup.properties.fillGradient)
			{
				drawingGroup.properties.fill = 0xFF00FF;//this.createGradient(drawingGroup, drawingGroup.properties.fillGradient);
			}
		}

		this.setViewCenter([this.world.physicsManager.worldWidth * 0.5, this.world.physicsManager.worldHeight * 0.5], 1);
		this.drawStaticLayers();
		// if (this.debug)
		// {
		// 	this.debugCanvas = this.createGraphics();
		// 	this.debugContext = this.debugCanvas.getContext('2d');
		// 	this.addLayer(this.multiCanvas ? this.container : this.mainCanvas.parentNode, this.debugCanvas, false);
		// }
	},

	setViewCenter: function ($vc, $scale)
	{
		this.viewCenter[0] = $vc[0];//Math.round($vc[0] * 10) / 10;
		this.viewCenter[1] = $vc[1];//Math.round($vc[1] * 10) / 10;
		this.viewWidth = this.width / this.scaleX;
		this.viewHeight = this.height / this.scaleX;
		this.viewportScale = $scale || this.viewportScale;
		// this.viewPortContainer.x = this.width * 0.5;
		// this.viewPortContainer.y = this.height * 0.5;
		// this.mainPixiContainer.x = -this.viewCenter[0];
		// this.mainPixiContainer.y = -this.viewCenter[1];
		// this.mainPixiContainer.pivot.x = this.width * 0.5;
		// this.mainPixiContainer.pivot.y = this.height * 0.5;
		//this.viewportScale = 1;
		this.mainPixiContainer.scale.x = this.mainPixiContainer.scale.y = this.viewportScale / this.scaleX / this.ratio;
		// this.mainPixiContainer.x = (-this.viewCenter[0]) * this.viewportScale + this.width * 0.5;
		// this.mainPixiContainer.y = (-this.viewCenter[1]) * this.viewportScale + this.height * 0.5;

		this.mainPixiContainer.position.x = -this.viewCenter[0] * this.scaleX * this.mainPixiContainer.scale.x + this.width * 0.5;
		this.mainPixiContainer.position.y = -this.viewCenter[1] * this.scaleX * this.mainPixiContainer.scale.y + this.height * 0.5;
	},

	setScale: function ()
	{
		return;
	},

	setTranslate: function ()
	{
		return false;
	},

	updateDynamicLayers: function ()
	{
		return;
	},

	checkViewport: function ()
	{
			// if (lastScale === this.viewportScale)
			// {
			// 	this.setTranslate();
			// }
			// else
			// {
			// 	this.setScale();
			// }
	},

	drawStaticLayers: function ()
	{
		var previous;
		for (var i = 0; i < this.staticGroupsLength; i += 1)
		{
			var drawingGroup = this.staticGroups[i];
			if (previous !== drawingGroup.graphics) { drawingGroup.graphics.clear(); }
			this.drawGroup(drawingGroup);
			previous = drawingGroup.graphics;
		}
	},

	drawDynamicLayers: function ()
	{
		var previous;
		for (var i = 0; i < this.dynamicGroupsLength; i += 1)
		{
			var drawingGroup = this.dynamicGroups[i];
			if (previous !== drawingGroup.graphics) { drawingGroup.graphics.clear(); }
			this.drawGroup(drawingGroup);
			previous = drawingGroup.graphics;
		}
	},

	draw: function ()
	{
		this.drawDynamicLayers();
		this.renderer.render(this.stage);
		//this.mainContext.clearRect(0, 0, this.width, this.height);
		//this.checkViewport();
		// var previous;
		// for (var i = 0; i < this.dynamicGroupsLength; i += 1)
		// {
		// 	var drawingGroup = this.dynamicGroups[i];
		// 	if (previous !== drawingGroup.context) { drawingGroup.context.clearRect(0, 0, this.width, this.height); }
		// 	//drawingGroup.context.scale(this.contextScaleX, this.contextScaleY);
		// 	previous = drawingGroup.context;
		// 	this.drawGroup(drawingGroup, drawingGroup.context);
		// }

		// if (this.debug) { this.debugDraw(true); }
	},

	drawGroup: function (drawingGroup, force)
	{
		var graphics = drawingGroup.graphics;
		var properties = drawingGroup.properties;

		if (properties.fill !== 'none') { graphics.beginFill(properties.fill, properties.opacity); }
		if (properties.stroke !== 'none') { graphics.lineStyle(properties.lineWidth, properties.stroke, properties.opacity); }
		else { graphics.lineStyle(0); }

		// if (context.fillStyle !== drawingGroup.properties.fill) { context.fillStyle = drawingGroup.properties.fill; }
		// if (context.strokeStyle !== drawingGroup.properties.stroke) { context.strokeStyle = drawingGroup.properties.stroke; }
		// if (context.lineWidth !== drawingGroup.properties.lineWidth) { context.lineWidth = drawingGroup.properties.lineWidth; }
		// if (context.lineCap !== drawingGroup.properties.lineCap) { context.lineCap = drawingGroup.properties.lineCap; }
		// if (context.lineJoin !== drawingGroup.properties.lineJoin) { context.lineJoin = drawingGroup.properties.lineJoin; }
		// if (context.globalAlpha !== drawingGroup.properties.opacity) { context.globalAlpha = drawingGroup.properties.opacity; }

		for (var i = 0, length = drawingGroup.objectDrawingsLength; i < length; i += 1)
		{
			var currObjectDrawing = drawingGroup.objectDrawings[i];
			this.drawObject(currObjectDrawing, drawingGroup, force);
		}
		//graphics.endFill();
		// if (drawingGroup.properties.closePath) { context.closePath(); }
		// if (drawingGroup.properties.fill !== 'none') { context.fill(); }
		// if (drawingGroup.properties.stroke !== 'none') { context.stroke(); }
		// if (drawingGroup.properties.opacity !== 1) { context.globalAlpha = 1; }
	},

	drawObject: function (objectDrawing, drawingGroup, force)
	{
		var graphics = drawingGroup.graphics;
		if (!force)
		{
			var toto = 'tut';
			toto += 1;
			// var boundingBox = objectDrawing.getBoundingBox();
			// if (boundingBox[1][0] * this.scaleX < this.viewX) { return; }
			// if (boundingBox[1][1] * this.scaleY < this.viewY) { return; }
			// if (boundingBox[0][0] * this.scaleX > this.viewX + this.viewWidth) { return; }
			// if (boundingBox[0][1] * this.scaleY > this.viewY + this.viewHeight) { return; }
		}

		for (var k = 0; k < objectDrawing.commandsLength; k += 1)
		{
			var currCommand = objectDrawing.commands[k];
			var point = [currCommand.getX(), currCommand.getY()];

			if (currCommand.name === MOVE_TO)
			{
				graphics.moveTo(point[0], point[1]);
			}
			else if (currCommand.name === LINE_TO)
			{
				graphics.lineTo(point[0], point[1]);
				continue;
			}
			else if (currCommand.name === CIRCLE)
			{
				graphics.moveTo(point[0] + currCommand.radius, point[1]);
				graphics.drawCircle(point[0], point[1], currCommand.radius);
			}
			if (!drawingGroup.isSimpleDrawing)
			{
				var cp1;

				if (currCommand.name === BEZIER_TO || currCommand.name === QUADRA_TO)
				{
					cp1 = currCommand.getCP1();
				}

				if (currCommand.name === BEZIER_TO)
				{
					var cp2 = currCommand.getCP2();
					graphics.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], point[0], point[1]);
				}
				else if (currCommand.name === QUADRA_TO)
				{
					graphics.quadraticCurveTo(cp1[0], cp1[1], point[0], point[1]);
				}
				else if (currCommand.name === ELLIPSE)
				{
					graphics.moveTo(point[0], point[1]);
					graphics.drawEllipse(point[0], point[1], currCommand.radius, currCommand.radiusB, currCommand.getRotation(), 0, twoPIS);
				}
			}
		}
	},

	precalculating: function ($drawingGroup)
	{
		//precalculating some instructions
		var fill = $drawingGroup.properties.fill;
		if (fill.indexOf('#') > -1)
		{
			fill = parseInt(fill.substr(1, 7), 16);
		}
		var stroke = $drawingGroup.properties.stroke;
		if (stroke.indexOf('#') > -1)
		{
			stroke = parseInt(stroke.substr(1, 7), 16);
		}
		$drawingGroup.properties.fill = fill;
		$drawingGroup.properties.stroke = stroke;
		$drawingGroup.properties.lineWidth = Math.max($drawingGroup.properties.lineWidth * this.scaleX, 1);
		$drawingGroup.properties.radiusX = $drawingGroup.properties.radiusX * this.scaleX;
		$drawingGroup.properties.radiusY = $drawingGroup.properties.radiusY * this.scaleY;
		for (var i = 0, objecDrawingsLength = $drawingGroup.objectDrawings.length; i < objecDrawingsLength; i += 1)
		{
			var currObjectDrawing = $drawingGroup.objectDrawings[i];
			var commandsLength = currObjectDrawing.commandsLength;
			for (var k = 0; k < commandsLength; k += 1)
			{
				var command = currObjectDrawing.commands[k];
				if ($drawingGroup.isSimpleDrawing && (command.name === BEZIER_TO || command.name === QUADRA_TO))
				{
					command.name = LINE_TO;
				}
				if ($drawingGroup.isSimpleDrawing && (command.name === ELLIPSE))
				{
					command.name = CIRCLE;
				}
			}
		}
	},

	createGraphics: function ()
	{
		var graphics = new PIXI.Graphics();
		this.mainPixiContainer.addChild(graphics);
		return graphics;
	},

	createGradient: function ($drawingGroup, $properties)
	{
		// var x1 = $properties.x1 * this.scaleX;
		// var y1 = $properties.y1 * this.scaleY;
		// var x2 = $properties.x2 * this.scaleX;
		// var y2 = $properties.y2 * this.scaleY;

		// var cx = $properties.cx * this.scaleX;
		// var cy = $properties.cy * this.scaleY;
		// var fx = $properties.fx * this.scaleX || cx;
		// var fy = $properties.fy * this.scaleY || cy;
		// var r = $properties.r * this.scaleX;

		// var gradient = $properties.type === 'linearGradient' ? $context.createLinearGradient(x1, y1, x2, y2) : $context.createRadialGradient(cx, cy, 0, fx, fy, r);

		// for (var stopN = 0, stopLength = $properties.stops.length; stopN < stopLength; stopN += 1)
		// {
		// 	gradient.addColorStop($properties.stops[stopN].offset, $properties.stops[stopN].color);
		// }

		// return gradient;
		return [$drawingGroup, $properties];
	},

	createDrawingGroup: function ($objectDrawing)
	{
		var drawingGroup;
		if ($objectDrawing.properties.opacity === 0) { return; }

		for (var i = 0, length = this.drawingGroups.length; i < length; i += 1)
		{
			var currDrawingGroup = this.drawingGroups[i];
			if (this.compareProperties(currDrawingGroup.properties, $objectDrawing.properties) &&
				(currDrawingGroup.willNotIntersect || $objectDrawing.willNotIntersect()) &&
				($objectDrawing.isStatic() === false && currDrawingGroup.isStatic === false) &&
				currDrawingGroup.isSimpleDrawing === $objectDrawing.isSimpleDrawing() &&
				$objectDrawing.properties.opacity === 1)
			{
				drawingGroup = currDrawingGroup;
			}
		}
		if (!drawingGroup)
		{
			drawingGroup =
			{
				properties: SVJellyUtils.extend({}, $objectDrawing.properties),
				isStatic: $objectDrawing.isStatic(),
				willNotIntersect: $objectDrawing.willNotIntersect(),
				isSimpleDrawing: $objectDrawing.isSimpleDrawing(),
				objectDrawings: []
			};
			this.drawingGroups.push(drawingGroup);
		}
		drawingGroup.objectDrawings.push($objectDrawing);
		// drawingGroup.nodes = drawingGroup.nodes.concat($group.drawing.nodes);
		return drawingGroup;
	},

	compareProperties: function ($one, $two)
	{
		var comparison = true;
		for (var name in $two)
		{
			if ($one[name] !== $two[name]) { comparison = false; }
		}
		return comparison;
	}

	// debugDraw: function ($clear)
	// {
	// 	if ($clear !== undefined) { this.debugContext.clearRect(0, 0, this.width, this.height); }

	// 	this.debugContext.setTransform(this.viewportScale, 0, 0, this.viewportScale, -this.viewCenter[0] * this.viewportScale + this.width * 0.5, -this.viewCenter[1] * this.viewportScale + this.height * 0.5);

	// 	this.debugContext.strokeStyle = 'yellow';
	// 	this.debugContext.lineCap = 'butt';
	// 	this.debugContext.lineJoin = 'miter';
	// 	this.debugContext.lineWidth = 1 / this.viewportScale;
	// 	this.debugContext.beginPath();
	// 	var currGroup;
	// 	var i;
	// 	var k;
	// 	var groupsLength = this.world.groups.length;
	// 	var nodesLength;
	// 	for (k = 0; k < groupsLength; k += 1)
	// 	{
	// 		currGroup = this.world.groups[k];

	// 		nodesLength = currGroup.nodes.length;
	// 		for (i = 0; i < nodesLength; i += 1)
	// 		{
	// 			var currNode = currGroup.nodes[i];
	// 			var xPos = currNode.getX() * this.scaleX;
	// 			var yPos = currNode.getY() * this.scaleY;
	// 			var radius = currNode.physicsManager.radius || currGroup.structure.radiusX || 0.01;
	// 			radius *= this.scaleX;
	// 			radius = Math.max(radius, 1);
	// 			// console.log(currGroup.structure.innerRadius, currGroup.conf.nodeRadius, currGroup.structure.radiusX);
	// 			// console.log(radius);
	// 			// debugger;
	// 			this.debugContext.moveTo(xPos + radius, yPos);
	// 			this.debugContext.arc(xPos, yPos, radius, 0, twoPIS);
	// 			if (currNode.physicsManager.body)
	// 			{
	// 				this.debugContext.moveTo(xPos, yPos);
	// 				var angle = twoPIS - currNode.physicsManager.body.angle;
	// 				this.debugContext.lineTo(xPos + Math.cos(angle) * radius, yPos + Math.sin(angle) * radius);
	// 			}
	// 		}
	// 	}
	// 	this.debugContext.stroke();

	// 	this.debugContext.strokeStyle = 'rgba(255,1,1,1)';
	// 	this.debugContext.beginPath();
	// 	for (k = 0; k < groupsLength; k += 1)
	// 	{
	// 		currGroup = this.world.groups[k];
	// 		var jointsLength = currGroup.joints.length;

	// 		for (i = 0; i < jointsLength; i += 1)
	// 		{
	// 			var currJoint = currGroup.joints[i];
	// 			this.debugContext.moveTo(currJoint.nodeA.getX() * this.scaleX, currJoint.nodeA.getY() * this.scaleY);
	// 			this.debugContext.lineTo(currJoint.nodeB.getX() * this.scaleX, currJoint.nodeB.getY() * this.scaleY);
	// 		}
	// 	}
	// 	this.debugContext.stroke();

	// 	this.debugContext.strokeStyle = 'blue';
	// 	this.debugContext.beginPath();
	// 	var length = this.world.groupConstraints.length;
	// 	for (k = 0; k < length; k += 1)
	// 	{
	// 		var currLock = this.world.groupConstraints[k];
	// 		this.debugContext.moveTo(currLock.anchorA.getX() * this.scaleX, currLock.anchorA.getY() * this.scaleY);
	// 		this.debugContext.lineTo(currLock.anchorB.getX() * this.scaleX, currLock.anchorB.getY() * this.scaleY);
	// 	}
	// 	this.debugContext.stroke();

	// 	this.debugContext.fillStyle = 'black';
	// 	for (k = 0; k < groupsLength; k += 1)
	// 	{
	// 		var group = this.world.groups[k];
	// 		nodesLength = group.nodes.length;
	// 		for (i = 0; i < nodesLength; i += 1)
	// 		{
	// 			var node = group.nodes[i];
	// 			if (node.debugText) { this.debugContext.fillText(node.debugText, node.getX() * this.scaleX, node.getY() * this.scaleY); }
	// 		}
	// 	}
	// }
};

module.exports = PixiRenderer;
