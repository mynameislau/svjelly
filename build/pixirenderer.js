(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.svjelly || (g.svjelly = {})).PixiRenderer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Lau/www/svjelly/src/core/Commands.js":[function(require,module,exports){
module.exports = {
	MOVE_TO: 1,
	LINE_TO: 2,
	BEZIER_TO: 3,
	QUADRA_TO: 4,
	CIRCLE: 5,
	ELLIPSE: 6
};

},{}],"/Users/Lau/www/svjelly/src/core/SVJellyUtils.js":[function(require,module,exports){
module.exports = {
	extend: function ($toExtend, $extension)
	{
		var recur = function ($object, $extend)
		{
			for (var name in $extend)
			{
				if (typeof $extend[name] === 'object' && !Array.isArray($extend[name]) && $extend[name] !== null)
				{
					if ($object[name] === undefined || $object[name] === null) { $object[name] = {}; }
					recur($object[name], $extend[name]);
				}
				else
				{
					$object[name] = $extend[name];
				}
			}
		};
		recur($toExtend, $extension);

		return $toExtend;
	}
};


},{}],"/Users/Lau/www/svjelly/src/renderer/pixi/PixiRenderer.js":[function(require,module,exports){
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

},{"../../core/Commands":"/Users/Lau/www/svjelly/src/core/Commands.js","../../core/SVJellyUtils":"/Users/Lau/www/svjelly/src/core/SVJellyUtils.js"}]},{},["/Users/Lau/www/svjelly/src/renderer/pixi/PixiRenderer.js"])("/Users/Lau/www/svjelly/src/renderer/pixi/PixiRenderer.js")
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db21tYW5kcy5qcyIsInNyYy9jb3JlL1NWSmVsbHlVdGlscy5qcyIsInNyYy9yZW5kZXJlci9waXhpL1BpeGlSZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdE1PVkVfVE86IDEsXG5cdExJTkVfVE86IDIsXG5cdEJFWklFUl9UTzogMyxcblx0UVVBRFJBX1RPOiA0LFxuXHRDSVJDTEU6IDUsXG5cdEVMTElQU0U6IDZcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0ZXh0ZW5kOiBmdW5jdGlvbiAoJHRvRXh0ZW5kLCAkZXh0ZW5zaW9uKVxuXHR7XG5cdFx0dmFyIHJlY3VyID0gZnVuY3Rpb24gKCRvYmplY3QsICRleHRlbmQpXG5cdFx0e1xuXHRcdFx0Zm9yICh2YXIgbmFtZSBpbiAkZXh0ZW5kKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAodHlwZW9mICRleHRlbmRbbmFtZV0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KCRleHRlbmRbbmFtZV0pICYmICRleHRlbmRbbmFtZV0gIT09IG51bGwpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoJG9iamVjdFtuYW1lXSA9PT0gdW5kZWZpbmVkIHx8ICRvYmplY3RbbmFtZV0gPT09IG51bGwpIHsgJG9iamVjdFtuYW1lXSA9IHt9OyB9XG5cdFx0XHRcdFx0cmVjdXIoJG9iamVjdFtuYW1lXSwgJGV4dGVuZFtuYW1lXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0JG9iamVjdFtuYW1lXSA9ICRleHRlbmRbbmFtZV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdHJlY3VyKCR0b0V4dGVuZCwgJGV4dGVuc2lvbik7XG5cblx0XHRyZXR1cm4gJHRvRXh0ZW5kO1xuXHR9XG59O1xuXG4iLCJ2YXIgQ29tbWFuZHMgPSByZXF1aXJlKCcuLi8uLi9jb3JlL0NvbW1hbmRzJyk7XG52YXIgQ0lSQ0xFID0gQ29tbWFuZHMuQ0lSQ0xFO1xudmFyIExJTkVfVE8gPSBDb21tYW5kcy5MSU5FX1RPO1xudmFyIE1PVkVfVE8gPSBDb21tYW5kcy5NT1ZFX1RPO1xudmFyIEJFWklFUl9UTyA9IENvbW1hbmRzLkJFWklFUl9UTztcbnZhciBRVUFEUkFfVE8gPSBDb21tYW5kcy5RVUFEUkFfVE87XG52YXIgRUxMSVBTRSA9IENvbW1hbmRzLkVMTElQU0U7XG52YXIgU1ZKZWxseVV0aWxzID0gcmVxdWlyZSgnLi4vLi4vY29yZS9TVkplbGx5VXRpbHMnKTtcbnZhciB0d29QSVMgPSBNYXRoLlBJICogMjtcbnZhciBQSVhJID0gd2luZG93LlBJWEk7XG5cbnZhciBQaXhpUmVuZGVyZXIgPVxue1xuXHRjcmVhdGU6IGZ1bmN0aW9uICgkd29ybGQsICRjb250YWluZXIpXG5cdHtcblx0XHR2YXIgaW5zdCA9IE9iamVjdC5jcmVhdGUoUGl4aVJlbmRlcmVyKTtcblxuXHRcdGluc3QuY29udGFpbmVyID0gJGNvbnRhaW5lcjtcblx0XHRpbnN0LndvcmxkID0gJHdvcmxkO1xuXHRcdGluc3QuZGVidWcgPSAkd29ybGQuY29uZi5kZWJ1ZztcblxuXHRcdHJldHVybiBpbnN0O1xuXHR9LFxuXG5cdHNldFNpemU6IGZ1bmN0aW9uICgkd2lkdGgsICRoZWlnaHQpXG5cdHtcblx0XHR3aGlsZSAodGhpcy5jb250YWluZXIuZmlyc3RDaGlsZClcblx0XHR7XG5cdFx0XHR0aGlzLmNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLmNvbnRhaW5lci5maXJzdENoaWxkKTtcblx0XHR9XG5cblx0XHR0aGlzLnN0YXRpY0dyYXBoaWNzID0gW107XG5cdFx0dGhpcy5keW5hbWljR3JhcGhpY3MgPSBbXTtcblx0XHR0aGlzLmNhbnZhc2VzID0gW107XG5cdFx0dGhpcy5sYXllcnMgPSBbXTtcblx0XHR0aGlzLmNhbnZhc2VzTGVuZ3RoID0gMDtcblx0XHR0aGlzLmNhY2hlZEhhcmQgPSBbXTtcblx0XHR0aGlzLmR5bmFtaWNHcm91cHMgPSBbXTtcblx0XHR0aGlzLnN0YXRpY0dyb3VwcyA9IFtdO1xuXHRcdHRoaXMuZHluYW1pY0dyb3Vwc0xlbmd0aCA9IHVuZGVmaW5lZDtcblxuXHRcdHRoaXMud2lkdGggPSAkd2lkdGg7XG5cdFx0dGhpcy5oZWlnaHQgPSAkaGVpZ2h0O1xuXG5cdFx0Y29uc29sZS5sb2coUElYSSk7XG5cdFx0dGhpcy5yZW5kZXJlciA9IG5ldyBQSVhJLldlYkdMUmVuZGVyZXIodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIHtcblx0XHRcdGFudGlhbGlhczogZmFsc2Vcblx0XHR9KTtcblx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLnZpZXcpO1xuXHRcdHRoaXMuc3RhZ2UgPSBuZXcgUElYSS5Db250YWluZXIoKTtcblx0XHR0aGlzLnZpZXdQb3J0Q29udGFpbmVyID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG5cdFx0dGhpcy5tYWluUGl4aUNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuXHRcdHRoaXMuc3RhZ2UuYWRkQ2hpbGQodGhpcy52aWV3UG9ydENvbnRhaW5lcik7XG5cdFx0dGhpcy52aWV3UG9ydENvbnRhaW5lci5hZGRDaGlsZCh0aGlzLm1haW5QaXhpQ29udGFpbmVyKTtcblxuXHRcdHRoaXMucmF0aW8gPSB0aGlzLndvcmxkLmdldFdpZHRoKCkgLyB0aGlzLndpZHRoO1xuXG5cdFx0dGhpcy5wcmV2aW91c1ZpZXdDZW50ZXIgPSBbbnVsbCwgbnVsbF07XG5cdFx0dGhpcy52aWV3Q2VudGVyID0gWzAsIDBdO1xuXHRcdHRoaXMudmlld3BvcnRTY2FsZSA9IHVuZGVmaW5lZDtcblx0XHR0aGlzLnByZXZpb3VzVmlld3BvcnRTY2FsZSA9IHVuZGVmaW5lZDtcblxuXHRcdHRoaXMuc2NhbGVYID0gdGhpcy5zY2FsZVkgPSAxMDA7Ly8xIC8gdGhpcy5yYXRpbztcblxuXHRcdC8vY3JlYXRpbmcgZHJhd2luZyBncm91cHNcblx0XHR0aGlzLmRyYXdpbmdHcm91cHMgPSBbXTtcblx0XHR2YXIgayA9IDA7XG5cdFx0dmFyIGk7XG5cdFx0Zm9yICh2YXIgZ3JvdXBzTGVuZ3RoID0gdGhpcy53b3JsZC5kcmF3aW5ncy5sZW5ndGg7IGsgPCBncm91cHNMZW5ndGg7IGsgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgY3VyckRyYXdpbmcgPSB0aGlzLndvcmxkLmRyYXdpbmdzW2tdO1xuXHRcdFx0Y3VyckRyYXdpbmcuc2V0U2NhbGUodGhpcy5zY2FsZVgsIHRoaXMuc2NhbGVZKTtcblx0XHRcdHRoaXMuY3JlYXRlRHJhd2luZ0dyb3VwKGN1cnJEcmF3aW5nKTtcblx0XHR9XG5cdFx0dGhpcy5kcmF3aW5nR3JvdXBzTGVuZ3RoID0gdGhpcy5kcmF3aW5nR3JvdXBzLmxlbmd0aDtcblxuXHRcdHZhciBkcmF3aW5nR3JvdXA7XG5cblx0XHQvL2NyZWF0aW5nIGNhbnZhcyBhbmQgY2FjaGluZyBub24gbW92aW5nIGdyb3Vwc1xuXHRcdGkgPSAwO1xuXHRcdHZhciBncmFwaGljcztcblx0XHRmb3IgKGk7IGkgPCB0aGlzLmRyYXdpbmdHcm91cHNMZW5ndGg7IGkgKz0gMSlcblx0XHR7XG5cdFx0XHRkcmF3aW5nR3JvdXAgPSB0aGlzLmRyYXdpbmdHcm91cHNbaV07XG5cdFx0XHRpZiAoZHJhd2luZ0dyb3VwLmlzU3RhdGljKVxuXHRcdFx0e1xuXHRcdFx0XHRncmFwaGljcyA9IHRoaXMuc3RhdGljR3JhcGhpY3NbaSAtIDFdIHx8IHRoaXMuY3JlYXRlR3JhcGhpY3MoKTtcblx0XHRcdFx0dGhpcy5zdGF0aWNHcmFwaGljc1tpXSA9IGdyYXBoaWNzO1xuXHRcdFx0XHR0aGlzLnN0YXRpY0dyb3Vwcy5wdXNoKGRyYXdpbmdHcm91cCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdGdyYXBoaWNzID0gdGhpcy5keW5hbWljR3JhcGhpY3NbaSAtIDFdIHx8IHRoaXMuY3JlYXRlR3JhcGhpY3MoKTtcblx0XHRcdFx0dGhpcy5keW5hbWljR3JhcGhpY3NbaV0gPSBncmFwaGljcztcblx0XHRcdFx0dGhpcy5keW5hbWljR3JvdXBzLnB1c2goZHJhd2luZ0dyb3VwKTtcblx0XHRcdH1cblx0XHRcdGRyYXdpbmdHcm91cC5ncmFwaGljcyA9IGdyYXBoaWNzO1xuXHRcdH1cblx0XHR0aGlzLmR5bmFtaWNHcm91cHNMZW5ndGggPSB0aGlzLmR5bmFtaWNHcm91cHMubGVuZ3RoO1xuXHRcdHRoaXMuc3RhdGljR3JvdXBzTGVuZ3RoID0gdGhpcy5zdGF0aWNHcm91cHMubGVuZ3RoO1xuXHRcdC8vXG5cblx0XHQvL2NhY2hpbmcgZ3JhZGllbnRzIGFuZCBwcmVjYWxjdWxhdGluZ1xuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLmRyYXdpbmdHcm91cHNMZW5ndGg7IGkgKz0gMSlcblx0XHR7XG5cdFx0XHRkcmF3aW5nR3JvdXAgPSB0aGlzLmRyYXdpbmdHcm91cHNbaV07XG5cdFx0XHR0aGlzLnByZWNhbGN1bGF0aW5nKGRyYXdpbmdHcm91cCk7XG5cdFx0XHRkcmF3aW5nR3JvdXAub2JqZWN0RHJhd2luZ3NMZW5ndGggPSBkcmF3aW5nR3JvdXAub2JqZWN0RHJhd2luZ3MubGVuZ3RoO1xuXHRcdFx0Ly9cblx0XHRcdGlmIChkcmF3aW5nR3JvdXAucHJvcGVydGllcy5zdHJva2VHcmFkaWVudClcblx0XHRcdHtcblx0XHRcdFx0ZHJhd2luZ0dyb3VwLnByb3BlcnRpZXMuc3Ryb2tlID0gMHhGRjAwRkY7Ly90aGlzLmNyZWF0ZUdyYWRpZW50KGRyYXdpbmdHcm91cCwgZHJhd2luZ0dyb3VwLnByb3BlcnRpZXMuc3Ryb2tlR3JhZGllbnQpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGRyYXdpbmdHcm91cC5wcm9wZXJ0aWVzLmZpbGxHcmFkaWVudClcblx0XHRcdHtcblx0XHRcdFx0ZHJhd2luZ0dyb3VwLnByb3BlcnRpZXMuZmlsbCA9IDB4RkYwMEZGOy8vdGhpcy5jcmVhdGVHcmFkaWVudChkcmF3aW5nR3JvdXAsIGRyYXdpbmdHcm91cC5wcm9wZXJ0aWVzLmZpbGxHcmFkaWVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWaWV3Q2VudGVyKFt0aGlzLndvcmxkLnBoeXNpY3NNYW5hZ2VyLndvcmxkV2lkdGggKiAwLjUsIHRoaXMud29ybGQucGh5c2ljc01hbmFnZXIud29ybGRIZWlnaHQgKiAwLjVdLCAxKTtcblx0XHR0aGlzLmRyYXdTdGF0aWNMYXllcnMoKTtcblx0XHQvLyBpZiAodGhpcy5kZWJ1Zylcblx0XHQvLyB7XG5cdFx0Ly8gXHR0aGlzLmRlYnVnQ2FudmFzID0gdGhpcy5jcmVhdGVHcmFwaGljcygpO1xuXHRcdC8vIFx0dGhpcy5kZWJ1Z0NvbnRleHQgPSB0aGlzLmRlYnVnQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Ly8gXHR0aGlzLmFkZExheWVyKHRoaXMubXVsdGlDYW52YXMgPyB0aGlzLmNvbnRhaW5lciA6IHRoaXMubWFpbkNhbnZhcy5wYXJlbnROb2RlLCB0aGlzLmRlYnVnQ2FudmFzLCBmYWxzZSk7XG5cdFx0Ly8gfVxuXHR9LFxuXG5cdHNldFZpZXdDZW50ZXI6IGZ1bmN0aW9uICgkdmMsICRzY2FsZSlcblx0e1xuXHRcdHRoaXMudmlld0NlbnRlclswXSA9ICR2Y1swXTsvL01hdGgucm91bmQoJHZjWzBdICogMTApIC8gMTA7XG5cdFx0dGhpcy52aWV3Q2VudGVyWzFdID0gJHZjWzFdOy8vTWF0aC5yb3VuZCgkdmNbMV0gKiAxMCkgLyAxMDtcblx0XHR0aGlzLnZpZXdXaWR0aCA9IHRoaXMud2lkdGggLyB0aGlzLnNjYWxlWDtcblx0XHR0aGlzLnZpZXdIZWlnaHQgPSB0aGlzLmhlaWdodCAvIHRoaXMuc2NhbGVYO1xuXHRcdHRoaXMudmlld3BvcnRTY2FsZSA9ICRzY2FsZSB8fCB0aGlzLnZpZXdwb3J0U2NhbGU7XG5cdFx0Ly8gdGhpcy52aWV3UG9ydENvbnRhaW5lci54ID0gdGhpcy53aWR0aCAqIDAuNTtcblx0XHQvLyB0aGlzLnZpZXdQb3J0Q29udGFpbmVyLnkgPSB0aGlzLmhlaWdodCAqIDAuNTtcblx0XHQvLyB0aGlzLm1haW5QaXhpQ29udGFpbmVyLnggPSAtdGhpcy52aWV3Q2VudGVyWzBdO1xuXHRcdC8vIHRoaXMubWFpblBpeGlDb250YWluZXIueSA9IC10aGlzLnZpZXdDZW50ZXJbMV07XG5cdFx0Ly8gdGhpcy5tYWluUGl4aUNvbnRhaW5lci5waXZvdC54ID0gdGhpcy53aWR0aCAqIDAuNTtcblx0XHQvLyB0aGlzLm1haW5QaXhpQ29udGFpbmVyLnBpdm90LnkgPSB0aGlzLmhlaWdodCAqIDAuNTtcblx0XHQvL3RoaXMudmlld3BvcnRTY2FsZSA9IDE7XG5cdFx0dGhpcy5tYWluUGl4aUNvbnRhaW5lci5zY2FsZS54ID0gdGhpcy5tYWluUGl4aUNvbnRhaW5lci5zY2FsZS55ID0gdGhpcy52aWV3cG9ydFNjYWxlIC8gdGhpcy5zY2FsZVggLyB0aGlzLnJhdGlvO1xuXHRcdC8vIHRoaXMubWFpblBpeGlDb250YWluZXIueCA9ICgtdGhpcy52aWV3Q2VudGVyWzBdKSAqIHRoaXMudmlld3BvcnRTY2FsZSArIHRoaXMud2lkdGggKiAwLjU7XG5cdFx0Ly8gdGhpcy5tYWluUGl4aUNvbnRhaW5lci55ID0gKC10aGlzLnZpZXdDZW50ZXJbMV0pICogdGhpcy52aWV3cG9ydFNjYWxlICsgdGhpcy5oZWlnaHQgKiAwLjU7XG5cblx0XHR0aGlzLm1haW5QaXhpQ29udGFpbmVyLnBvc2l0aW9uLnggPSAtdGhpcy52aWV3Q2VudGVyWzBdICogdGhpcy5zY2FsZVggKiB0aGlzLm1haW5QaXhpQ29udGFpbmVyLnNjYWxlLnggKyB0aGlzLndpZHRoICogMC41O1xuXHRcdHRoaXMubWFpblBpeGlDb250YWluZXIucG9zaXRpb24ueSA9IC10aGlzLnZpZXdDZW50ZXJbMV0gKiB0aGlzLnNjYWxlWCAqIHRoaXMubWFpblBpeGlDb250YWluZXIuc2NhbGUueSArIHRoaXMuaGVpZ2h0ICogMC41O1xuXHR9LFxuXG5cdHNldFNjYWxlOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0cmV0dXJuO1xuXHR9LFxuXG5cdHNldFRyYW5zbGF0ZTogZnVuY3Rpb24gKClcblx0e1xuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblxuXHR1cGRhdGVEeW5hbWljTGF5ZXJzOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0cmV0dXJuO1xuXHR9LFxuXG5cdGNoZWNrVmlld3BvcnQ6IGZ1bmN0aW9uICgpXG5cdHtcblx0XHRcdC8vIGlmIChsYXN0U2NhbGUgPT09IHRoaXMudmlld3BvcnRTY2FsZSlcblx0XHRcdC8vIHtcblx0XHRcdC8vIFx0dGhpcy5zZXRUcmFuc2xhdGUoKTtcblx0XHRcdC8vIH1cblx0XHRcdC8vIGVsc2Vcblx0XHRcdC8vIHtcblx0XHRcdC8vIFx0dGhpcy5zZXRTY2FsZSgpO1xuXHRcdFx0Ly8gfVxuXHR9LFxuXG5cdGRyYXdTdGF0aWNMYXllcnM6IGZ1bmN0aW9uICgpXG5cdHtcblx0XHR2YXIgcHJldmlvdXM7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN0YXRpY0dyb3Vwc0xlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBkcmF3aW5nR3JvdXAgPSB0aGlzLnN0YXRpY0dyb3Vwc1tpXTtcblx0XHRcdGlmIChwcmV2aW91cyAhPT0gZHJhd2luZ0dyb3VwLmdyYXBoaWNzKSB7IGRyYXdpbmdHcm91cC5ncmFwaGljcy5jbGVhcigpOyB9XG5cdFx0XHR0aGlzLmRyYXdHcm91cChkcmF3aW5nR3JvdXApO1xuXHRcdFx0cHJldmlvdXMgPSBkcmF3aW5nR3JvdXAuZ3JhcGhpY3M7XG5cdFx0fVxuXHR9LFxuXG5cdGRyYXdEeW5hbWljTGF5ZXJzOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0dmFyIHByZXZpb3VzO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5keW5hbWljR3JvdXBzTGVuZ3RoOyBpICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGRyYXdpbmdHcm91cCA9IHRoaXMuZHluYW1pY0dyb3Vwc1tpXTtcblx0XHRcdGlmIChwcmV2aW91cyAhPT0gZHJhd2luZ0dyb3VwLmdyYXBoaWNzKSB7IGRyYXdpbmdHcm91cC5ncmFwaGljcy5jbGVhcigpOyB9XG5cdFx0XHR0aGlzLmRyYXdHcm91cChkcmF3aW5nR3JvdXApO1xuXHRcdFx0cHJldmlvdXMgPSBkcmF3aW5nR3JvdXAuZ3JhcGhpY3M7XG5cdFx0fVxuXHR9LFxuXG5cdGRyYXc6IGZ1bmN0aW9uICgpXG5cdHtcblx0XHR0aGlzLmRyYXdEeW5hbWljTGF5ZXJzKCk7XG5cdFx0dGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zdGFnZSk7XG5cdFx0Ly90aGlzLm1haW5Db250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cdFx0Ly90aGlzLmNoZWNrVmlld3BvcnQoKTtcblx0XHQvLyB2YXIgcHJldmlvdXM7XG5cdFx0Ly8gZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmR5bmFtaWNHcm91cHNMZW5ndGg7IGkgKz0gMSlcblx0XHQvLyB7XG5cdFx0Ly8gXHR2YXIgZHJhd2luZ0dyb3VwID0gdGhpcy5keW5hbWljR3JvdXBzW2ldO1xuXHRcdC8vIFx0aWYgKHByZXZpb3VzICE9PSBkcmF3aW5nR3JvdXAuY29udGV4dCkgeyBkcmF3aW5nR3JvdXAuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpOyB9XG5cdFx0Ly8gXHQvL2RyYXdpbmdHcm91cC5jb250ZXh0LnNjYWxlKHRoaXMuY29udGV4dFNjYWxlWCwgdGhpcy5jb250ZXh0U2NhbGVZKTtcblx0XHQvLyBcdHByZXZpb3VzID0gZHJhd2luZ0dyb3VwLmNvbnRleHQ7XG5cdFx0Ly8gXHR0aGlzLmRyYXdHcm91cChkcmF3aW5nR3JvdXAsIGRyYXdpbmdHcm91cC5jb250ZXh0KTtcblx0XHQvLyB9XG5cblx0XHQvLyBpZiAodGhpcy5kZWJ1ZykgeyB0aGlzLmRlYnVnRHJhdyh0cnVlKTsgfVxuXHR9LFxuXG5cdGRyYXdHcm91cDogZnVuY3Rpb24gKGRyYXdpbmdHcm91cCwgZm9yY2UpXG5cdHtcblx0XHR2YXIgZ3JhcGhpY3MgPSBkcmF3aW5nR3JvdXAuZ3JhcGhpY3M7XG5cdFx0dmFyIHByb3BlcnRpZXMgPSBkcmF3aW5nR3JvdXAucHJvcGVydGllcztcblxuXHRcdGlmIChwcm9wZXJ0aWVzLmZpbGwgIT09ICdub25lJykgeyBncmFwaGljcy5iZWdpbkZpbGwocHJvcGVydGllcy5maWxsLCBwcm9wZXJ0aWVzLm9wYWNpdHkpOyB9XG5cdFx0aWYgKHByb3BlcnRpZXMuc3Ryb2tlICE9PSAnbm9uZScpIHsgZ3JhcGhpY3MubGluZVN0eWxlKHByb3BlcnRpZXMubGluZVdpZHRoLCBwcm9wZXJ0aWVzLnN0cm9rZSwgcHJvcGVydGllcy5vcGFjaXR5KTsgfVxuXHRcdGVsc2UgeyBncmFwaGljcy5saW5lU3R5bGUoMCk7IH1cblxuXHRcdC8vIGlmIChjb250ZXh0LmZpbGxTdHlsZSAhPT0gZHJhd2luZ0dyb3VwLnByb3BlcnRpZXMuZmlsbCkgeyBjb250ZXh0LmZpbGxTdHlsZSA9IGRyYXdpbmdHcm91cC5wcm9wZXJ0aWVzLmZpbGw7IH1cblx0XHQvLyBpZiAoY29udGV4dC5zdHJva2VTdHlsZSAhPT0gZHJhd2luZ0dyb3VwLnByb3BlcnRpZXMuc3Ryb2tlKSB7IGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBkcmF3aW5nR3JvdXAucHJvcGVydGllcy5zdHJva2U7IH1cblx0XHQvLyBpZiAoY29udGV4dC5saW5lV2lkdGggIT09IGRyYXdpbmdHcm91cC5wcm9wZXJ0aWVzLmxpbmVXaWR0aCkgeyBjb250ZXh0LmxpbmVXaWR0aCA9IGRyYXdpbmdHcm91cC5wcm9wZXJ0aWVzLmxpbmVXaWR0aDsgfVxuXHRcdC8vIGlmIChjb250ZXh0LmxpbmVDYXAgIT09IGRyYXdpbmdHcm91cC5wcm9wZXJ0aWVzLmxpbmVDYXApIHsgY29udGV4dC5saW5lQ2FwID0gZHJhd2luZ0dyb3VwLnByb3BlcnRpZXMubGluZUNhcDsgfVxuXHRcdC8vIGlmIChjb250ZXh0LmxpbmVKb2luICE9PSBkcmF3aW5nR3JvdXAucHJvcGVydGllcy5saW5lSm9pbikgeyBjb250ZXh0LmxpbmVKb2luID0gZHJhd2luZ0dyb3VwLnByb3BlcnRpZXMubGluZUpvaW47IH1cblx0XHQvLyBpZiAoY29udGV4dC5nbG9iYWxBbHBoYSAhPT0gZHJhd2luZ0dyb3VwLnByb3BlcnRpZXMub3BhY2l0eSkgeyBjb250ZXh0Lmdsb2JhbEFscGhhID0gZHJhd2luZ0dyb3VwLnByb3BlcnRpZXMub3BhY2l0eTsgfVxuXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGRyYXdpbmdHcm91cC5vYmplY3REcmF3aW5nc0xlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyT2JqZWN0RHJhd2luZyA9IGRyYXdpbmdHcm91cC5vYmplY3REcmF3aW5nc1tpXTtcblx0XHRcdHRoaXMuZHJhd09iamVjdChjdXJyT2JqZWN0RHJhd2luZywgZHJhd2luZ0dyb3VwLCBmb3JjZSk7XG5cdFx0fVxuXHRcdC8vZ3JhcGhpY3MuZW5kRmlsbCgpO1xuXHRcdC8vIGlmIChkcmF3aW5nR3JvdXAucHJvcGVydGllcy5jbG9zZVBhdGgpIHsgY29udGV4dC5jbG9zZVBhdGgoKTsgfVxuXHRcdC8vIGlmIChkcmF3aW5nR3JvdXAucHJvcGVydGllcy5maWxsICE9PSAnbm9uZScpIHsgY29udGV4dC5maWxsKCk7IH1cblx0XHQvLyBpZiAoZHJhd2luZ0dyb3VwLnByb3BlcnRpZXMuc3Ryb2tlICE9PSAnbm9uZScpIHsgY29udGV4dC5zdHJva2UoKTsgfVxuXHRcdC8vIGlmIChkcmF3aW5nR3JvdXAucHJvcGVydGllcy5vcGFjaXR5ICE9PSAxKSB7IGNvbnRleHQuZ2xvYmFsQWxwaGEgPSAxOyB9XG5cdH0sXG5cblx0ZHJhd09iamVjdDogZnVuY3Rpb24gKG9iamVjdERyYXdpbmcsIGRyYXdpbmdHcm91cCwgZm9yY2UpXG5cdHtcblx0XHR2YXIgZ3JhcGhpY3MgPSBkcmF3aW5nR3JvdXAuZ3JhcGhpY3M7XG5cdFx0aWYgKCFmb3JjZSlcblx0XHR7XG5cdFx0XHR2YXIgdG90byA9ICd0dXQnO1xuXHRcdFx0dG90byArPSAxO1xuXHRcdFx0Ly8gdmFyIGJvdW5kaW5nQm94ID0gb2JqZWN0RHJhd2luZy5nZXRCb3VuZGluZ0JveCgpO1xuXHRcdFx0Ly8gaWYgKGJvdW5kaW5nQm94WzFdWzBdICogdGhpcy5zY2FsZVggPCB0aGlzLnZpZXdYKSB7IHJldHVybjsgfVxuXHRcdFx0Ly8gaWYgKGJvdW5kaW5nQm94WzFdWzFdICogdGhpcy5zY2FsZVkgPCB0aGlzLnZpZXdZKSB7IHJldHVybjsgfVxuXHRcdFx0Ly8gaWYgKGJvdW5kaW5nQm94WzBdWzBdICogdGhpcy5zY2FsZVggPiB0aGlzLnZpZXdYICsgdGhpcy52aWV3V2lkdGgpIHsgcmV0dXJuOyB9XG5cdFx0XHQvLyBpZiAoYm91bmRpbmdCb3hbMF1bMV0gKiB0aGlzLnNjYWxlWSA+IHRoaXMudmlld1kgKyB0aGlzLnZpZXdIZWlnaHQpIHsgcmV0dXJuOyB9XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBvYmplY3REcmF3aW5nLmNvbW1hbmRzTGVuZ3RoOyBrICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJDb21tYW5kID0gb2JqZWN0RHJhd2luZy5jb21tYW5kc1trXTtcblx0XHRcdHZhciBwb2ludCA9IFtjdXJyQ29tbWFuZC5nZXRYKCksIGN1cnJDb21tYW5kLmdldFkoKV07XG5cblx0XHRcdGlmIChjdXJyQ29tbWFuZC5uYW1lID09PSBNT1ZFX1RPKVxuXHRcdFx0e1xuXHRcdFx0XHRncmFwaGljcy5tb3ZlVG8ocG9pbnRbMF0sIHBvaW50WzFdKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGN1cnJDb21tYW5kLm5hbWUgPT09IExJTkVfVE8pXG5cdFx0XHR7XG5cdFx0XHRcdGdyYXBoaWNzLmxpbmVUbyhwb2ludFswXSwgcG9pbnRbMV0pO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGN1cnJDb21tYW5kLm5hbWUgPT09IENJUkNMRSlcblx0XHRcdHtcblx0XHRcdFx0Z3JhcGhpY3MubW92ZVRvKHBvaW50WzBdICsgY3VyckNvbW1hbmQucmFkaXVzLCBwb2ludFsxXSk7XG5cdFx0XHRcdGdyYXBoaWNzLmRyYXdDaXJjbGUocG9pbnRbMF0sIHBvaW50WzFdLCBjdXJyQ29tbWFuZC5yYWRpdXMpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFkcmF3aW5nR3JvdXAuaXNTaW1wbGVEcmF3aW5nKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgY3AxO1xuXG5cdFx0XHRcdGlmIChjdXJyQ29tbWFuZC5uYW1lID09PSBCRVpJRVJfVE8gfHwgY3VyckNvbW1hbmQubmFtZSA9PT0gUVVBRFJBX1RPKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y3AxID0gY3VyckNvbW1hbmQuZ2V0Q1AxKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY3VyckNvbW1hbmQubmFtZSA9PT0gQkVaSUVSX1RPKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dmFyIGNwMiA9IGN1cnJDb21tYW5kLmdldENQMigpO1xuXHRcdFx0XHRcdGdyYXBoaWNzLmJlemllckN1cnZlVG8oY3AxWzBdLCBjcDFbMV0sIGNwMlswXSwgY3AyWzFdLCBwb2ludFswXSwgcG9pbnRbMV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKGN1cnJDb21tYW5kLm5hbWUgPT09IFFVQURSQV9UTylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGdyYXBoaWNzLnF1YWRyYXRpY0N1cnZlVG8oY3AxWzBdLCBjcDFbMV0sIHBvaW50WzBdLCBwb2ludFsxXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoY3VyckNvbW1hbmQubmFtZSA9PT0gRUxMSVBTRSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGdyYXBoaWNzLm1vdmVUbyhwb2ludFswXSwgcG9pbnRbMV0pO1xuXHRcdFx0XHRcdGdyYXBoaWNzLmRyYXdFbGxpcHNlKHBvaW50WzBdLCBwb2ludFsxXSwgY3VyckNvbW1hbmQucmFkaXVzLCBjdXJyQ29tbWFuZC5yYWRpdXNCLCBjdXJyQ29tbWFuZC5nZXRSb3RhdGlvbigpLCAwLCB0d29QSVMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHByZWNhbGN1bGF0aW5nOiBmdW5jdGlvbiAoJGRyYXdpbmdHcm91cClcblx0e1xuXHRcdC8vcHJlY2FsY3VsYXRpbmcgc29tZSBpbnN0cnVjdGlvbnNcblx0XHR2YXIgZmlsbCA9ICRkcmF3aW5nR3JvdXAucHJvcGVydGllcy5maWxsO1xuXHRcdGlmIChmaWxsLmluZGV4T2YoJyMnKSA+IC0xKVxuXHRcdHtcblx0XHRcdGZpbGwgPSBwYXJzZUludChmaWxsLnN1YnN0cigxLCA3KSwgMTYpO1xuXHRcdH1cblx0XHR2YXIgc3Ryb2tlID0gJGRyYXdpbmdHcm91cC5wcm9wZXJ0aWVzLnN0cm9rZTtcblx0XHRpZiAoc3Ryb2tlLmluZGV4T2YoJyMnKSA+IC0xKVxuXHRcdHtcblx0XHRcdHN0cm9rZSA9IHBhcnNlSW50KHN0cm9rZS5zdWJzdHIoMSwgNyksIDE2KTtcblx0XHR9XG5cdFx0JGRyYXdpbmdHcm91cC5wcm9wZXJ0aWVzLmZpbGwgPSBmaWxsO1xuXHRcdCRkcmF3aW5nR3JvdXAucHJvcGVydGllcy5zdHJva2UgPSBzdHJva2U7XG5cdFx0JGRyYXdpbmdHcm91cC5wcm9wZXJ0aWVzLmxpbmVXaWR0aCA9IE1hdGgubWF4KCRkcmF3aW5nR3JvdXAucHJvcGVydGllcy5saW5lV2lkdGggKiB0aGlzLnNjYWxlWCwgMSk7XG5cdFx0JGRyYXdpbmdHcm91cC5wcm9wZXJ0aWVzLnJhZGl1c1ggPSAkZHJhd2luZ0dyb3VwLnByb3BlcnRpZXMucmFkaXVzWCAqIHRoaXMuc2NhbGVYO1xuXHRcdCRkcmF3aW5nR3JvdXAucHJvcGVydGllcy5yYWRpdXNZID0gJGRyYXdpbmdHcm91cC5wcm9wZXJ0aWVzLnJhZGl1c1kgKiB0aGlzLnNjYWxlWTtcblx0XHRmb3IgKHZhciBpID0gMCwgb2JqZWNEcmF3aW5nc0xlbmd0aCA9ICRkcmF3aW5nR3JvdXAub2JqZWN0RHJhd2luZ3MubGVuZ3RoOyBpIDwgb2JqZWNEcmF3aW5nc0xlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyT2JqZWN0RHJhd2luZyA9ICRkcmF3aW5nR3JvdXAub2JqZWN0RHJhd2luZ3NbaV07XG5cdFx0XHR2YXIgY29tbWFuZHNMZW5ndGggPSBjdXJyT2JqZWN0RHJhd2luZy5jb21tYW5kc0xlbmd0aDtcblx0XHRcdGZvciAodmFyIGsgPSAwOyBrIDwgY29tbWFuZHNMZW5ndGg7IGsgKz0gMSlcblx0XHRcdHtcblx0XHRcdFx0dmFyIGNvbW1hbmQgPSBjdXJyT2JqZWN0RHJhd2luZy5jb21tYW5kc1trXTtcblx0XHRcdFx0aWYgKCRkcmF3aW5nR3JvdXAuaXNTaW1wbGVEcmF3aW5nICYmIChjb21tYW5kLm5hbWUgPT09IEJFWklFUl9UTyB8fCBjb21tYW5kLm5hbWUgPT09IFFVQURSQV9UTykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb21tYW5kLm5hbWUgPSBMSU5FX1RPO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICgkZHJhd2luZ0dyb3VwLmlzU2ltcGxlRHJhd2luZyAmJiAoY29tbWFuZC5uYW1lID09PSBFTExJUFNFKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbW1hbmQubmFtZSA9IENJUkNMRTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRjcmVhdGVHcmFwaGljczogZnVuY3Rpb24gKClcblx0e1xuXHRcdHZhciBncmFwaGljcyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG5cdFx0dGhpcy5tYWluUGl4aUNvbnRhaW5lci5hZGRDaGlsZChncmFwaGljcyk7XG5cdFx0cmV0dXJuIGdyYXBoaWNzO1xuXHR9LFxuXG5cdGNyZWF0ZUdyYWRpZW50OiBmdW5jdGlvbiAoJGRyYXdpbmdHcm91cCwgJHByb3BlcnRpZXMpXG5cdHtcblx0XHQvLyB2YXIgeDEgPSAkcHJvcGVydGllcy54MSAqIHRoaXMuc2NhbGVYO1xuXHRcdC8vIHZhciB5MSA9ICRwcm9wZXJ0aWVzLnkxICogdGhpcy5zY2FsZVk7XG5cdFx0Ly8gdmFyIHgyID0gJHByb3BlcnRpZXMueDIgKiB0aGlzLnNjYWxlWDtcblx0XHQvLyB2YXIgeTIgPSAkcHJvcGVydGllcy55MiAqIHRoaXMuc2NhbGVZO1xuXG5cdFx0Ly8gdmFyIGN4ID0gJHByb3BlcnRpZXMuY3ggKiB0aGlzLnNjYWxlWDtcblx0XHQvLyB2YXIgY3kgPSAkcHJvcGVydGllcy5jeSAqIHRoaXMuc2NhbGVZO1xuXHRcdC8vIHZhciBmeCA9ICRwcm9wZXJ0aWVzLmZ4ICogdGhpcy5zY2FsZVggfHwgY3g7XG5cdFx0Ly8gdmFyIGZ5ID0gJHByb3BlcnRpZXMuZnkgKiB0aGlzLnNjYWxlWSB8fCBjeTtcblx0XHQvLyB2YXIgciA9ICRwcm9wZXJ0aWVzLnIgKiB0aGlzLnNjYWxlWDtcblxuXHRcdC8vIHZhciBncmFkaWVudCA9ICRwcm9wZXJ0aWVzLnR5cGUgPT09ICdsaW5lYXJHcmFkaWVudCcgPyAkY29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudCh4MSwgeTEsIHgyLCB5MikgOiAkY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudChjeCwgY3ksIDAsIGZ4LCBmeSwgcik7XG5cblx0XHQvLyBmb3IgKHZhciBzdG9wTiA9IDAsIHN0b3BMZW5ndGggPSAkcHJvcGVydGllcy5zdG9wcy5sZW5ndGg7IHN0b3BOIDwgc3RvcExlbmd0aDsgc3RvcE4gKz0gMSlcblx0XHQvLyB7XG5cdFx0Ly8gXHRncmFkaWVudC5hZGRDb2xvclN0b3AoJHByb3BlcnRpZXMuc3RvcHNbc3RvcE5dLm9mZnNldCwgJHByb3BlcnRpZXMuc3RvcHNbc3RvcE5dLmNvbG9yKTtcblx0XHQvLyB9XG5cblx0XHQvLyByZXR1cm4gZ3JhZGllbnQ7XG5cdFx0cmV0dXJuIFskZHJhd2luZ0dyb3VwLCAkcHJvcGVydGllc107XG5cdH0sXG5cblx0Y3JlYXRlRHJhd2luZ0dyb3VwOiBmdW5jdGlvbiAoJG9iamVjdERyYXdpbmcpXG5cdHtcblx0XHR2YXIgZHJhd2luZ0dyb3VwO1xuXHRcdGlmICgkb2JqZWN0RHJhd2luZy5wcm9wZXJ0aWVzLm9wYWNpdHkgPT09IDApIHsgcmV0dXJuOyB9XG5cblx0XHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gdGhpcy5kcmF3aW5nR3JvdXBzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyRHJhd2luZ0dyb3VwID0gdGhpcy5kcmF3aW5nR3JvdXBzW2ldO1xuXHRcdFx0aWYgKHRoaXMuY29tcGFyZVByb3BlcnRpZXMoY3VyckRyYXdpbmdHcm91cC5wcm9wZXJ0aWVzLCAkb2JqZWN0RHJhd2luZy5wcm9wZXJ0aWVzKSAmJlxuXHRcdFx0XHQoY3VyckRyYXdpbmdHcm91cC53aWxsTm90SW50ZXJzZWN0IHx8ICRvYmplY3REcmF3aW5nLndpbGxOb3RJbnRlcnNlY3QoKSkgJiZcblx0XHRcdFx0KCRvYmplY3REcmF3aW5nLmlzU3RhdGljKCkgPT09IGZhbHNlICYmIGN1cnJEcmF3aW5nR3JvdXAuaXNTdGF0aWMgPT09IGZhbHNlKSAmJlxuXHRcdFx0XHRjdXJyRHJhd2luZ0dyb3VwLmlzU2ltcGxlRHJhd2luZyA9PT0gJG9iamVjdERyYXdpbmcuaXNTaW1wbGVEcmF3aW5nKCkgJiZcblx0XHRcdFx0JG9iamVjdERyYXdpbmcucHJvcGVydGllcy5vcGFjaXR5ID09PSAxKVxuXHRcdFx0e1xuXHRcdFx0XHRkcmF3aW5nR3JvdXAgPSBjdXJyRHJhd2luZ0dyb3VwO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoIWRyYXdpbmdHcm91cClcblx0XHR7XG5cdFx0XHRkcmF3aW5nR3JvdXAgPVxuXHRcdFx0e1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiBTVkplbGx5VXRpbHMuZXh0ZW5kKHt9LCAkb2JqZWN0RHJhd2luZy5wcm9wZXJ0aWVzKSxcblx0XHRcdFx0aXNTdGF0aWM6ICRvYmplY3REcmF3aW5nLmlzU3RhdGljKCksXG5cdFx0XHRcdHdpbGxOb3RJbnRlcnNlY3Q6ICRvYmplY3REcmF3aW5nLndpbGxOb3RJbnRlcnNlY3QoKSxcblx0XHRcdFx0aXNTaW1wbGVEcmF3aW5nOiAkb2JqZWN0RHJhd2luZy5pc1NpbXBsZURyYXdpbmcoKSxcblx0XHRcdFx0b2JqZWN0RHJhd2luZ3M6IFtdXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5kcmF3aW5nR3JvdXBzLnB1c2goZHJhd2luZ0dyb3VwKTtcblx0XHR9XG5cdFx0ZHJhd2luZ0dyb3VwLm9iamVjdERyYXdpbmdzLnB1c2goJG9iamVjdERyYXdpbmcpO1xuXHRcdC8vIGRyYXdpbmdHcm91cC5ub2RlcyA9IGRyYXdpbmdHcm91cC5ub2Rlcy5jb25jYXQoJGdyb3VwLmRyYXdpbmcubm9kZXMpO1xuXHRcdHJldHVybiBkcmF3aW5nR3JvdXA7XG5cdH0sXG5cblx0Y29tcGFyZVByb3BlcnRpZXM6IGZ1bmN0aW9uICgkb25lLCAkdHdvKVxuXHR7XG5cdFx0dmFyIGNvbXBhcmlzb24gPSB0cnVlO1xuXHRcdGZvciAodmFyIG5hbWUgaW4gJHR3bylcblx0XHR7XG5cdFx0XHRpZiAoJG9uZVtuYW1lXSAhPT0gJHR3b1tuYW1lXSkgeyBjb21wYXJpc29uID0gZmFsc2U7IH1cblx0XHR9XG5cdFx0cmV0dXJuIGNvbXBhcmlzb247XG5cdH1cblxuXHQvLyBkZWJ1Z0RyYXc6IGZ1bmN0aW9uICgkY2xlYXIpXG5cdC8vIHtcblx0Ly8gXHRpZiAoJGNsZWFyICE9PSB1bmRlZmluZWQpIHsgdGhpcy5kZWJ1Z0NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTsgfVxuXG5cdC8vIFx0dGhpcy5kZWJ1Z0NvbnRleHQuc2V0VHJhbnNmb3JtKHRoaXMudmlld3BvcnRTY2FsZSwgMCwgMCwgdGhpcy52aWV3cG9ydFNjYWxlLCAtdGhpcy52aWV3Q2VudGVyWzBdICogdGhpcy52aWV3cG9ydFNjYWxlICsgdGhpcy53aWR0aCAqIDAuNSwgLXRoaXMudmlld0NlbnRlclsxXSAqIHRoaXMudmlld3BvcnRTY2FsZSArIHRoaXMuaGVpZ2h0ICogMC41KTtcblxuXHQvLyBcdHRoaXMuZGVidWdDb250ZXh0LnN0cm9rZVN0eWxlID0gJ3llbGxvdyc7XG5cdC8vIFx0dGhpcy5kZWJ1Z0NvbnRleHQubGluZUNhcCA9ICdidXR0Jztcblx0Ly8gXHR0aGlzLmRlYnVnQ29udGV4dC5saW5lSm9pbiA9ICdtaXRlcic7XG5cdC8vIFx0dGhpcy5kZWJ1Z0NvbnRleHQubGluZVdpZHRoID0gMSAvIHRoaXMudmlld3BvcnRTY2FsZTtcblx0Ly8gXHR0aGlzLmRlYnVnQ29udGV4dC5iZWdpblBhdGgoKTtcblx0Ly8gXHR2YXIgY3Vyckdyb3VwO1xuXHQvLyBcdHZhciBpO1xuXHQvLyBcdHZhciBrO1xuXHQvLyBcdHZhciBncm91cHNMZW5ndGggPSB0aGlzLndvcmxkLmdyb3Vwcy5sZW5ndGg7XG5cdC8vIFx0dmFyIG5vZGVzTGVuZ3RoO1xuXHQvLyBcdGZvciAoayA9IDA7IGsgPCBncm91cHNMZW5ndGg7IGsgKz0gMSlcblx0Ly8gXHR7XG5cdC8vIFx0XHRjdXJyR3JvdXAgPSB0aGlzLndvcmxkLmdyb3Vwc1trXTtcblxuXHQvLyBcdFx0bm9kZXNMZW5ndGggPSBjdXJyR3JvdXAubm9kZXMubGVuZ3RoO1xuXHQvLyBcdFx0Zm9yIChpID0gMDsgaSA8IG5vZGVzTGVuZ3RoOyBpICs9IDEpXG5cdC8vIFx0XHR7XG5cdC8vIFx0XHRcdHZhciBjdXJyTm9kZSA9IGN1cnJHcm91cC5ub2Rlc1tpXTtcblx0Ly8gXHRcdFx0dmFyIHhQb3MgPSBjdXJyTm9kZS5nZXRYKCkgKiB0aGlzLnNjYWxlWDtcblx0Ly8gXHRcdFx0dmFyIHlQb3MgPSBjdXJyTm9kZS5nZXRZKCkgKiB0aGlzLnNjYWxlWTtcblx0Ly8gXHRcdFx0dmFyIHJhZGl1cyA9IGN1cnJOb2RlLnBoeXNpY3NNYW5hZ2VyLnJhZGl1cyB8fCBjdXJyR3JvdXAuc3RydWN0dXJlLnJhZGl1c1ggfHwgMC4wMTtcblx0Ly8gXHRcdFx0cmFkaXVzICo9IHRoaXMuc2NhbGVYO1xuXHQvLyBcdFx0XHRyYWRpdXMgPSBNYXRoLm1heChyYWRpdXMsIDEpO1xuXHQvLyBcdFx0XHQvLyBjb25zb2xlLmxvZyhjdXJyR3JvdXAuc3RydWN0dXJlLmlubmVyUmFkaXVzLCBjdXJyR3JvdXAuY29uZi5ub2RlUmFkaXVzLCBjdXJyR3JvdXAuc3RydWN0dXJlLnJhZGl1c1gpO1xuXHQvLyBcdFx0XHQvLyBjb25zb2xlLmxvZyhyYWRpdXMpO1xuXHQvLyBcdFx0XHQvLyBkZWJ1Z2dlcjtcblx0Ly8gXHRcdFx0dGhpcy5kZWJ1Z0NvbnRleHQubW92ZVRvKHhQb3MgKyByYWRpdXMsIHlQb3MpO1xuXHQvLyBcdFx0XHR0aGlzLmRlYnVnQ29udGV4dC5hcmMoeFBvcywgeVBvcywgcmFkaXVzLCAwLCB0d29QSVMpO1xuXHQvLyBcdFx0XHRpZiAoY3Vyck5vZGUucGh5c2ljc01hbmFnZXIuYm9keSlcblx0Ly8gXHRcdFx0e1xuXHQvLyBcdFx0XHRcdHRoaXMuZGVidWdDb250ZXh0Lm1vdmVUbyh4UG9zLCB5UG9zKTtcblx0Ly8gXHRcdFx0XHR2YXIgYW5nbGUgPSB0d29QSVMgLSBjdXJyTm9kZS5waHlzaWNzTWFuYWdlci5ib2R5LmFuZ2xlO1xuXHQvLyBcdFx0XHRcdHRoaXMuZGVidWdDb250ZXh0LmxpbmVUbyh4UG9zICsgTWF0aC5jb3MoYW5nbGUpICogcmFkaXVzLCB5UG9zICsgTWF0aC5zaW4oYW5nbGUpICogcmFkaXVzKTtcblx0Ly8gXHRcdFx0fVxuXHQvLyBcdFx0fVxuXHQvLyBcdH1cblx0Ly8gXHR0aGlzLmRlYnVnQ29udGV4dC5zdHJva2UoKTtcblxuXHQvLyBcdHRoaXMuZGVidWdDb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LDEsMSwxKSc7XG5cdC8vIFx0dGhpcy5kZWJ1Z0NvbnRleHQuYmVnaW5QYXRoKCk7XG5cdC8vIFx0Zm9yIChrID0gMDsgayA8IGdyb3Vwc0xlbmd0aDsgayArPSAxKVxuXHQvLyBcdHtcblx0Ly8gXHRcdGN1cnJHcm91cCA9IHRoaXMud29ybGQuZ3JvdXBzW2tdO1xuXHQvLyBcdFx0dmFyIGpvaW50c0xlbmd0aCA9IGN1cnJHcm91cC5qb2ludHMubGVuZ3RoO1xuXG5cdC8vIFx0XHRmb3IgKGkgPSAwOyBpIDwgam9pbnRzTGVuZ3RoOyBpICs9IDEpXG5cdC8vIFx0XHR7XG5cdC8vIFx0XHRcdHZhciBjdXJySm9pbnQgPSBjdXJyR3JvdXAuam9pbnRzW2ldO1xuXHQvLyBcdFx0XHR0aGlzLmRlYnVnQ29udGV4dC5tb3ZlVG8oY3VyckpvaW50Lm5vZGVBLmdldFgoKSAqIHRoaXMuc2NhbGVYLCBjdXJySm9pbnQubm9kZUEuZ2V0WSgpICogdGhpcy5zY2FsZVkpO1xuXHQvLyBcdFx0XHR0aGlzLmRlYnVnQ29udGV4dC5saW5lVG8oY3VyckpvaW50Lm5vZGVCLmdldFgoKSAqIHRoaXMuc2NhbGVYLCBjdXJySm9pbnQubm9kZUIuZ2V0WSgpICogdGhpcy5zY2FsZVkpO1xuXHQvLyBcdFx0fVxuXHQvLyBcdH1cblx0Ly8gXHR0aGlzLmRlYnVnQ29udGV4dC5zdHJva2UoKTtcblxuXHQvLyBcdHRoaXMuZGVidWdDb250ZXh0LnN0cm9rZVN0eWxlID0gJ2JsdWUnO1xuXHQvLyBcdHRoaXMuZGVidWdDb250ZXh0LmJlZ2luUGF0aCgpO1xuXHQvLyBcdHZhciBsZW5ndGggPSB0aGlzLndvcmxkLmdyb3VwQ29uc3RyYWludHMubGVuZ3RoO1xuXHQvLyBcdGZvciAoayA9IDA7IGsgPCBsZW5ndGg7IGsgKz0gMSlcblx0Ly8gXHR7XG5cdC8vIFx0XHR2YXIgY3VyckxvY2sgPSB0aGlzLndvcmxkLmdyb3VwQ29uc3RyYWludHNba107XG5cdC8vIFx0XHR0aGlzLmRlYnVnQ29udGV4dC5tb3ZlVG8oY3VyckxvY2suYW5jaG9yQS5nZXRYKCkgKiB0aGlzLnNjYWxlWCwgY3VyckxvY2suYW5jaG9yQS5nZXRZKCkgKiB0aGlzLnNjYWxlWSk7XG5cdC8vIFx0XHR0aGlzLmRlYnVnQ29udGV4dC5saW5lVG8oY3VyckxvY2suYW5jaG9yQi5nZXRYKCkgKiB0aGlzLnNjYWxlWCwgY3VyckxvY2suYW5jaG9yQi5nZXRZKCkgKiB0aGlzLnNjYWxlWSk7XG5cdC8vIFx0fVxuXHQvLyBcdHRoaXMuZGVidWdDb250ZXh0LnN0cm9rZSgpO1xuXG5cdC8vIFx0dGhpcy5kZWJ1Z0NvbnRleHQuZmlsbFN0eWxlID0gJ2JsYWNrJztcblx0Ly8gXHRmb3IgKGsgPSAwOyBrIDwgZ3JvdXBzTGVuZ3RoOyBrICs9IDEpXG5cdC8vIFx0e1xuXHQvLyBcdFx0dmFyIGdyb3VwID0gdGhpcy53b3JsZC5ncm91cHNba107XG5cdC8vIFx0XHRub2Rlc0xlbmd0aCA9IGdyb3VwLm5vZGVzLmxlbmd0aDtcblx0Ly8gXHRcdGZvciAoaSA9IDA7IGkgPCBub2Rlc0xlbmd0aDsgaSArPSAxKVxuXHQvLyBcdFx0e1xuXHQvLyBcdFx0XHR2YXIgbm9kZSA9IGdyb3VwLm5vZGVzW2ldO1xuXHQvLyBcdFx0XHRpZiAobm9kZS5kZWJ1Z1RleHQpIHsgdGhpcy5kZWJ1Z0NvbnRleHQuZmlsbFRleHQobm9kZS5kZWJ1Z1RleHQsIG5vZGUuZ2V0WCgpICogdGhpcy5zY2FsZVgsIG5vZGUuZ2V0WSgpICogdGhpcy5zY2FsZVkpOyB9XG5cdC8vIFx0XHR9XG5cdC8vIFx0fVxuXHQvLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBpeGlSZW5kZXJlcjtcbiJdfQ==
