var Commands = require('../../core/Commands');
var ARC = Commands.ARC;
var LINE_TO = Commands.LINE_TO;
var MOVE_TO = Commands.MOVE_TO;
var BEZIER_TO = Commands.BEZIER_TO;
var QUADRA_TO = Commands.QUADRA_TO;
var ELLIPSE = Commands.ELLIPSE;
var SVJellyUtils = require('../../core/SVJellyUtils');

var SVJellyRenderer =//function ($world, $canvas)
{
	create: function ($world, $container)
	{
		var inst = Object.create(SVJellyRenderer);

		inst.container = inst.mainCanvas = $container;
		inst.world = $world;
		inst.multiCanvas = $world.conf.multiCanvas;
		if (inst.multicanvas) { inst.mainContext = inst.mainCanvas.getContext('2d'); }
		inst.debug = $world.conf.debug;

		//inst.setSize($width, $height);

		if (!inst.multiCanvas) { inst.container = inst.mainCanvas; }

		return inst;
	},

	setSize: function ($width, $height)
	{
		while (this.container.firstChild)
		{
			this.container.removeChild(this.container.firstChild);
		}

		this.staticCanvas = [];
		this.dynamicCanvas = [];
		this.canvases = [];
		this.layers = [];
		this.canvasesLength = 0;
		this.cachedHard = [];
		this.dynamicGroups = [];
		this.staticGroups = [];
		this.dynamicGroupsLength = undefined;

		this.width = $width;
		this.height = $height;

		this.ratio = this.width / this.world.getWidth();

		this.previousViewport = [[null, null], [null, null]];
		this.viewport = [[0, 0], [0, 0]];
		this.viewportScale = undefined;

		this.scaleX = this.scaleY = this.ratio;

		//creating drawing groups
		this.drawingGroups = [];
		var k = 0;
		var i;
		for (var groupsLength = this.world.groups.length; k < groupsLength; k += 1)
		{
			var currGroup = this.world.groups[k];
			this.createDrawingGroup(currGroup.drawing);
		}
		this.drawingGroupsLength = this.drawingGroups.length;

		var drawingGroup;

		//creating canvas and caching non moving groups
		i = 0;
		var canvas;
		var layer;
		var context;
		for (i; i < this.drawingGroupsLength; i += 1)
		{
			drawingGroup = this.drawingGroups[i];
			if (drawingGroup.isStatic)
			{
				//if some static layers are on top of each other, no need to create
				//a new canvas, you can just draw the layers on the same one
				if (!this.staticCanvas[i - 1])
				{
					canvas = this.createCanvas();
					layer = this.createCanvas();
				}
				else
				{
					canvas = this.drawingGroups[i - 1].canvas;
					layer = this.drawingGroups[i - 1].layer;
				}
				//canvas = this.staticCanvas[i - 1] || this.createCanvas();
				context = canvas.getContext('2d');
				this.staticCanvas[i] = canvas;
				this.staticGroups.push(drawingGroup);
			}
			else
			{
				canvas = this.dynamicCanvas[i - 1] || this.createCanvas();
				layer = canvas;
				context = canvas.getContext('2d');
				this.dynamicCanvas[i] = canvas;
				this.dynamicGroups.push(drawingGroup);
			}
			drawingGroup.canvas = canvas;
			drawingGroup.layer = layer;
			drawingGroup.context = context;
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
				drawingGroup.properties.stroke = this.createGradient(drawingGroup.context, drawingGroup.properties.strokeGradient);
			}
			if (drawingGroup.properties.fillGradient)
			{
				drawingGroup.properties.fill = this.createGradient(drawingGroup.context, drawingGroup.properties.fillGradient);
			}
		}

		// multi canvas
		if (this.multiCanvas)
		{
			this.container.style.position = 'relative';

			for (i = 0; i < this.drawingGroupsLength; i += 1)
			{
				drawingGroup = this.drawingGroups[i];
				layer = drawingGroup.layer;
				this.addLayer(this.container, layer, !drawingGroup.isStatic);
			}
		}
		this.draw = this.multiCanvas ? this.drawMultiCanvas : this.drawSingleCanvas;
		//

		//drawing once
		// for (i = 0; i < this.drawingGroupsLength; i += 1)
		// {
		// 	drawingGroup = this.drawingGroups[i];
		// 	this.drawGroup(drawingGroup, drawingGroup.context);
		// }

		//this.updateStaticLayers();

		//this.setViewport(this.width * 0.5, this.height * 0.5, this.width, this.height);
		this.setViewport([[0, 0], [this.width, this.height]]);
		// this.setViewport(0, 0, this.width * 0.5, this.height * 0.5);
		// this.setViewport(0, this.height * 0.5, this.width * 0.5, this.height);
		// this.setViewport(0, this.height * 0.5, this.width * 0.5, this.height);
		// this.setViewport(0, this.height * 0.5, this.width * 0.5, this.height);
		// this.setViewport(0, this.height * 0.5, this.width * 0.5, this.height);
		// this.setViewport(0, 0, this.width, this.height);
		// this.setViewport(0, this.height * 0.5, this.width * 0.5, this.height);
		// this.setViewport(0, this.height * 0.5, this.width * 0.5, this.height);
		// this.setViewport(0, this.height * 0.5, this.width * 0.5, this.height);
		//this.setViewport(0, 0, this.width * 0.5, this.height * 0.5);

		if (this.debug)
		{
			this.debugCanvas = this.createCanvas();
			this.debugContext = this.debugCanvas.getContext('2d');
			this.addLayer(this.multiCanvas ? this.container : this.mainCanvas.parentNode, this.debugCanvas, false);
		}

		// this.viewport = [[this.width * 0.5, this.height * 0.5], [this.width, this.height]];

		//caching hard stuff - not interesting performance-wise yet
		// for (i = 0; i < this.drawingGroupsLength; i += 1)
		// {
		// 	drawingGroup = this.drawingGroups[i];
		// 	if (drawingGroup.bodyType === 'hard' && !drawingGroup.fixed)
		// 	{
		// 		canvas = this.createCanvas();
		// 		this.drawGroup(drawingGroup, canvas.getContext('2d'));
		// 		this.cachedHard[i] = canvas;
		// 	}
		// }
	},

	setViewport: function ($vp)
	{
		this.viewport[0][0] = Math.round($vp[0][0] * 10) / 10;
		this.viewport[0][1] = Math.round($vp[0][1] * 10) / 10;
		this.viewport[1][0] = Math.round($vp[1][0] * 10) / 10;
		this.viewport[1][1] = Math.round($vp[1][1] * 10) / 10;
	},

	setScale: function ()
	{
		var previousStatic;
		console.log('setting scale');
		for (var i = 0; i < this.staticGroupsLength; i += 1)
		{
			var staticGroup = this.staticGroups[i];
			if (staticGroup.canvas !== previousStatic)
			{
				staticGroup.canvas.width = this.width * this.viewportScale;
				staticGroup.canvas.height = this.height * this.viewportScale;
				staticGroup.context.setTransform(this.viewportScale, 0, 0, this.viewportScale, 0, 0);//this.contextScale, this.contextScale);
				previousStatic = staticGroup.canvas;
			}
			this.drawGroup(staticGroup, staticGroup.context, true);
		}
		this.updateStaticLayers();
		this.updateDynamicLayers();
	},

	setTranslate: function ()
	{
		this.updateStaticLayers();
		this.updateDynamicLayers();
	},

	updateStaticLayers: function ()
	{
		var previous;
		var context;
		for (var i = 0; i < this.staticGroupsLength; i += 1)
		{
			var drawingGroup = this.staticGroups[i];
			var layer = drawingGroup.layer;
			//if (layer === previous) { continue; }

			context = layer.getContext('2d');
			context.clearRect(0, 0, this.width, this.height);
			var sX = this.viewport[0][0] * this.viewportScale;
			var sY = this.viewport[0][1] * this.viewportScale;
			context.drawImage(drawingGroup.canvas, sX, sY, this.width, this.height, 0, 0, this.width, this.height);//, 100, 0, this.width, this.height, this.viewport[0][0], this.viewport[0][1], 200, 200);//this.viewport[0][0], this.viewport[0][1], width, height);
			previous = layer;
		}
	},

	updateDynamicLayers: function ()
	{
		var previousDynamic;
		for (var i = 0; i < this.dynamicGroupsLength; i += 1)
		{
			var dynamicGroup = this.dynamicGroups[i];
			if (dynamicGroup.canvas === previousDynamic) { continue; }
			dynamicGroup.context.setTransform(this.viewportScale, 0, 0, this.viewportScale, -this.viewport[0][0] * this.viewportScale, -this.viewport[0][1] * this.viewportScale);
			previousDynamic = dynamicGroup.canvas;
		}
	},

	checkViewport: function ()
	{
		if (this.viewport[0][0] !== this.previousViewport[0][0] ||
			this.viewport[0][1] !== this.previousViewport[0][1] ||
			this.viewport[1][0] !== this.previousViewport[1][0] ||
			this.viewport[1][1] !== this.previousViewport[1][1])
		{
			var lastScale = this.viewportScale;
			this.viewportScale = (this.width / (this.viewport[1][0] - this.viewport[0][0]));

			if (lastScale === this.viewportScale)
			{
				this.setTranslate();
			}
			else
			{
				this.setScale();
			}
			this.previousViewport[0][0] = this.viewport[0][0];
			this.previousViewport[0][1] = this.viewport[0][1];
			this.previousViewport[1][0] = this.viewport[1][0];
			this.previousViewport[1][1] = this.viewport[1][1];
		}
	},

	drawMultiCanvas: function ()
	{
		//this.mainContext.clearRect(0, 0, this.width, this.height);
		this.checkViewport();
		var previous;
		for (var i = 0; i < this.dynamicGroupsLength; i += 1)
		{
			var drawingGroup = this.dynamicGroups[i];
			if (previous !== drawingGroup.context) { drawingGroup.context.clearRect(0, 0, this.width, this.height); }
			//drawingGroup.context.scale(this.contextScaleX, this.contextScaleY);
			previous = drawingGroup.context;
			this.drawGroup(drawingGroup, drawingGroup.context);
		}

		if (this.debug) { this.debugDraw(true); }
	},

	drawSingleCanvas: function ()
	{
		this.mainContext.clearRect(0, 0, this.width, this.height);
		//this.context.miterLimit = 1;
		var previousCached;
		for (var i = 0; i < this.drawingGroupsLength; i += 1)
		{
			var drawingGroup = this.drawingGroups[i];
			if (this.staticCanvas[i])
			{
				if (this.staticCanvas[i] === previousCached) { continue; }
				this.mainContext.drawImage(this.staticCanvas[i], 0, 0);
				previousCached = this.staticCanvas[i];
			}
			else
			{
				this.drawGroup(drawingGroup, this.mainContext);
			}
		}

		if (this.debug) { this.debugDraw(true); }
	},

	drawGroup: function (drawingGroup, context, force)
	{
		context.beginPath();

		if (context.fillStyle !== drawingGroup.properties.fill) { context.fillStyle = drawingGroup.properties.fill; }
		if (context.strokeStyle !== drawingGroup.properties.stroke) { context.strokeStyle = drawingGroup.properties.stroke; }
		if (context.lineWidth !== drawingGroup.properties.lineWidth) { context.lineWidth = drawingGroup.properties.lineWidth; }
		if (context.lineCap !== drawingGroup.properties.lineCap) { context.lineCap = drawingGroup.properties.lineCap; }
		if (context.lineJoin !== drawingGroup.properties.lineJoin) { context.lineJoin = drawingGroup.properties.lineJoin; }
		if (context.globalAlpha !== drawingGroup.properties.opacity) { context.globalAlpha = drawingGroup.properties.opacity; }

		for (var i = 0, length = drawingGroup.objectDrawingsLength; i < length; i += 1)
		{
			var currObjectDrawing = drawingGroup.objectDrawings[i];
			this.drawObject(currObjectDrawing, drawingGroup, context, force);
		}

		if (drawingGroup.properties.closePath) { context.closePath(); }
		if (drawingGroup.properties.fill !== 'none') { context.fill(); }
		if (drawingGroup.properties.stroke !== 'none') { context.stroke(); }
		if (drawingGroup.properties.opacity !== 1) { context.globalAlpha = 1; }
	},

	drawObject: function (objectDrawing, drawingGroup, context, force)
	{
		if (!force)
		{
			var boundingBox = objectDrawing.getBoundingBox();
			if (boundingBox[1][0] * this.scaleX < this.viewport[0][0]) { return; }
			if (boundingBox[1][1] * this.scaleY < this.viewport[0][1]) { return; }
			if (boundingBox[0][0] * this.scaleX > this.viewport[1][0]) { return; }
			if (boundingBox[0][1] * this.scaleY > this.viewport[1][1]) { return; }
		}

		for (var k = 0; k < objectDrawing.commandsLength; k += 1)
		{
			var currCommand = objectDrawing.commands[k];

			if (currCommand.name === MOVE_TO)
			{
				context.moveTo(currCommand.getX() * this.scaleX, currCommand.getY() * this.scaleY);

				//special case for lines with nice dynamic gradients
				if (drawingGroup.properties.dynamicGradient)
				{
					var x1 = currCommand.getX() * this.scaleX;
					var y1 = currCommand.getY() * this.scaleY;
					var x2 = currCommand.endCommand.getX() * this.scaleX;
					var y2 = currCommand.endCommand.getY() * this.scaleY;
					var gradient = context.createLinearGradient(x1, y1, x2, y2);
					for (var stopN = 0, stopLength = objectDrawing.properties.strokeGradient.stops.length; stopN < stopLength; stopN += 1)
					{
						gradient.addColorStop(1 - objectDrawing.properties.strokeGradient.stops[stopN].offset, objectDrawing.properties.strokeGradient.stops[stopN].color);
					}
					context.strokeStyle = gradient;
				}
				//
			}
			else if (currCommand.name === LINE_TO)
			{
				context.lineTo(currCommand.getX() * this.scaleX, currCommand.getY() * this.scaleY);
				continue;
			}
			else if (currCommand.name === ARC)
			{
				context.moveTo(currCommand.getX() * this.scaleX + currCommand.options[0], currCommand.getY() * this.scaleY);
				context.arc(currCommand.getX() * this.scaleX, currCommand.getY() * this.scaleY, currCommand.options[0], 0, Math.PI * 2);
			}
			if (!drawingGroup.isSimpleDrawing)
			{
				var options = currCommand.options;
				var baseX = currCommand.getX() * this.scaleX;
				var baseY = currCommand.getY() * this.scaleY;
				var cp1x;
				var cp1y;

				if (currCommand.name === BEZIER_TO || currCommand.name === QUADRA_TO)
				{
					cp1x = baseX + options[0][0];
					cp1y = baseY + options[0][1];
				}

				if (currCommand.name === BEZIER_TO)
				{
					var cp2x = baseX + options[1][0];
					var cp2y = baseY + options[1][1];
					context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, baseX, baseY);
					//context.lineTo(baseX, baseY);
				}
				else if (currCommand.name === QUADRA_TO)
				{
					context.quadraticCurveTo(cp1x, cp1y, baseX, baseY);
				}
				else if (currCommand.name === ELLIPSE)
				{
					context.moveTo(currCommand.getX() * this.scaleX, currCommand.getY() * this.scaleY);
					context.ellipse(currCommand.getX() * this.scaleX, currCommand.getY() * this.scaleY, currCommand.options[0], currCommand.options[1], currCommand.options[2], 0, Math.PI * 2);
				}
			}
		}
	},

	precalculating: function ($drawingGroup)
	{
		//precalculating some instructions
		$drawingGroup.properties.lineWidth = $drawingGroup.properties.lineWidth * this.scaleX;
		$drawingGroup.properties.radiusX = $drawingGroup.properties.radiusX * this.scaleX;
		$drawingGroup.properties.radiusY = $drawingGroup.properties.radiusY * this.scaleY;
		for (var i = 0, objecDrawingsLength = $drawingGroup.objectDrawings.length; i < objecDrawingsLength; i += 1)
		{
			var currObjectDrawing = $drawingGroup.objectDrawings[i];
			var commandsLength = currObjectDrawing.commandsLength;
			for (var k = 0; k < commandsLength; k += 1)
			{
				var command = currObjectDrawing.commands[k];
				var options = command.options;
				if ($drawingGroup.isSimpleDrawing && (command.name === BEZIER_TO || command.name === QUADRA_TO))
				{
					command.name = LINE_TO;
				}
				if ($drawingGroup.isSimpleDrawing && (command.name === ELLIPSE))
				{
					command.name = ARC;
				}
				//precalculationg control points and radix;
				if (command.name === BEZIER_TO || command.name === QUADRA_TO)
				{
					for (var m = 0, length = options.length; m < length; m += 1)
					{
						var currOption = options[m];
						currOption[0] = currOption[0] * this.scaleX;
						currOption[1] = currOption[1] * this.scaleY;
					}
				}
				else if (command.name === ELLIPSE || command.name === ARC)
				{
					options[0] = options[0] * this.scaleX;
					options[1] = options[1] * this.scaleX;
				}
			}
		}
	},

	addLayer: function ($parent, $canvas, $pointerEvents)
	{
		if ($parent.contains($canvas)) { return; }
		$parent.appendChild($canvas);
		$canvas.style.position = 'absolute';
		// $canvas.style.top = this.mainCanvas.offsetTop + 'px';
		// $canvas.style.left = this.mainCanvas.offsetLeft + 'px';
		$canvas.style.pointerEvents = $pointerEvents ? 'auto' : 'none';
	},
	createCanvas: function ()
	{
		var canvas = window.document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		this.canvases.push(canvas);
		this.canvasesLength += 1;
		return canvas;
	},

	createGradient: function ($context, $properties)
	{
		var x1 = $properties.x1 * this.scaleX;
		var y1 = $properties.y1 * this.scaleY;
		var x2 = $properties.x2 * this.scaleX;
		var y2 = $properties.y2 * this.scaleY;

		var cx = $properties.cx * this.scaleX;
		var cy = $properties.cy * this.scaleY;
		var fx = $properties.fx * this.scaleX || cx;
		var fy = $properties.fy * this.scaleY || cy;
		var r = $properties.r * this.scaleX;

		var gradient = $properties.type === 'linearGradient' ? $context.createLinearGradient(x1, y1, x2, y2) : $context.createRadialGradient(cx, cy, 0, fx, fy, r);

		for (var stopN = 0, stopLength = $properties.stops.length; stopN < stopLength; stopN += 1)
		{
			gradient.addColorStop($properties.stops[stopN].offset, $properties.stops[stopN].color);
		}

		return gradient;
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
				$objectDrawing.isStatic() === false &&
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
	},

	debugDraw: function ($clear)
	{
		if ($clear !== undefined) { this.debugContext.clearRect(0, 0, this.width, this.height); }

		this.debugContext.strokeStyle = 'yellow';
		this.debugContext.lineCap = 'butt';
		this.debugContext.lineJoin = 'miter';
		this.debugContext.lineWidth = 1;
		this.debugContext.beginPath();
		var currGroup;
		var i;
		var k;
		var groupsLength = this.world.groups.length;
		var nodesLength;
		for (k = 0; k < groupsLength; k += 1)
		{
			currGroup = this.world.groups[k];

			nodesLength = currGroup.nodes.length;
			for (i = 0; i < nodesLength; i += 1)
			{
				var currNode = currGroup.nodes[i];
				var xPos = currNode.getX() * this.scaleX;
				var yPos = currNode.getY() * this.scaleY;
				var radius = currNode.physicsManager.radius || currGroup.structure.radiusX || 0.01;
				radius *= this.scaleX;
				radius = Math.max(radius, 1);
				// console.log(currGroup.structure.innerRadius, currGroup.conf.nodeRadius, currGroup.structure.radiusX);
				// console.log(radius);
				// debugger;
				this.debugContext.moveTo(xPos + radius, yPos);
				this.debugContext.arc(xPos, yPos, radius, 0, Math.PI * 2);
				if (currNode.physicsManager.body)
				{
					this.debugContext.moveTo(xPos, yPos);
					var angle = currNode.physicsManager.body.angle;
					this.debugContext.lineTo(xPos + Math.cos(angle) * radius, yPos + Math.sin(angle) * radius);
				}
			}
		}
		this.debugContext.stroke();

		this.debugContext.strokeStyle = 'rgba(255,1,1,1)';
		this.debugContext.beginPath();
		for (k = 0; k < groupsLength; k += 1)
		{
			currGroup = this.world.groups[k];
			var jointsLength = currGroup.joints.length;

			for (i = 0; i < jointsLength; i += 1)
			{
				var currJoint = currGroup.joints[i];
				this.debugContext.moveTo(currJoint.nodeA.getX() * this.scaleX, currJoint.nodeA.getY() * this.scaleY);
				this.debugContext.lineTo(currJoint.nodeB.getX() * this.scaleX, currJoint.nodeB.getY() * this.scaleY);
			}
		}
		this.debugContext.stroke();

		this.debugContext.strokeStyle = 'blue';
		this.debugContext.beginPath();
		var length = this.world.groupConstraints.length;
		for (k = 0; k < length; k += 1)
		{
			var currLock = this.world.groupConstraints[k];
			this.debugContext.moveTo(currLock.anchorA.getX() * this.scaleX, currLock.anchorA.getY() * this.scaleY);
			this.debugContext.lineTo(currLock.anchorB.getX() * this.scaleX, currLock.anchorB.getY() * this.scaleY);
		}
		this.debugContext.stroke();

		this.debugContext.fillStyle = 'black';
		for (k = 0; k < groupsLength; k += 1)
		{
			var group = this.world.groups[k];
			nodesLength = group.nodes.length;
			for (i = 0; i < nodesLength; i += 1)
			{
				var node = group.nodes[i];
				if (node.debugText) { this.debugContext.fillText(node.debugText, node.getX() * this.scaleX, node.getY() * this.scaleY); }
			}
		}
	}
};

module.exports = SVJellyRenderer;

