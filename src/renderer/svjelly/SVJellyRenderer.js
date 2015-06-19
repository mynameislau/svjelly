var Commands = require('../../core/Commands');
var ARC = Commands.ARC;
var LINE_TO = Commands.LINE_TO;
var MOVE_TO = Commands.MOVE_TO;
var BEZIER_TO = Commands.BEZIER_TO;
var QUADRA_TO = Commands.QUADRA_TO;
var ELLIPSE = Commands.ELLIPSE;

var SVJellyRenderer =//function ($world, $canvas)
{
	create: function ($world, $canvas)
	{
		var inst = Object.create(SVJellyRenderer);

		inst.mainContainer = inst.mainCanvas = $canvas;
		inst.world = $world;
		inst.multiCanvas = $world.conf.multiCanvas;
		inst.mainContext = inst.mainCanvas.getContext('2d');
		inst.debug = $world.conf.debug;
		inst.staticCanvas = [];
		inst.dynamicCanvas = [];
		inst.cachedHard = [];
		inst.dynamicGroups = [];
		inst.dynamicGroupsLength = undefined;

		inst.width = inst.mainCanvas.width;
		inst.height = inst.mainCanvas.height;

		inst.scaleX = inst.scaleY = inst.mainCanvas.width / inst.world.getWidth();

		inst.drawingGroups = [];
		var k = 0;
		var i;
		for (var groupsLength = inst.world.groups.length; k < groupsLength; k += 1)
		{
			var currGroup = inst.world.groups[k];
			inst.createDrawingGroup(currGroup);
		}
		inst.drawingGroupsLength = inst.drawingGroups.length;

		var drawingGroup;

		//caching non moving groups
		i = 0;
		var canvas;
		var context;
		for (i; i < inst.drawingGroupsLength; i += 1)
		{
			drawingGroup = inst.drawingGroups[i];
			if (drawingGroup.isStatic)
			{
				//if some static layers are on top of each other, no need to create
				//a new canvas, you can just draw the layers on the same one
				canvas = inst.staticCanvas[i - 1] || inst.createCanvas();
				context = canvas.getContext('2d');
				inst.staticCanvas[i] = canvas;
			}
			else
			{
				canvas = inst.dynamicCanvas[i - 1] || inst.createCanvas();
				context = canvas.getContext('2d');
				inst.dynamicCanvas[i] = canvas;
				inst.dynamicGroups.push(drawingGroup);
			}
			drawingGroup.canvas = canvas;
			drawingGroup.context = context;
		}
		inst.dynamicGroupsLength = inst.dynamicGroups.length;
		//

		//caching gradients and precalculating
		for (i = 0; i < inst.drawingGroupsLength; i += 1)
		{
			drawingGroup = inst.drawingGroups[i];
			//precalculating some instructions
			drawingGroup.properties.lineWidth = drawingGroup.properties.lineWidth * inst.scaleX;
			drawingGroup.properties.radiusX = drawingGroup.properties.radiusX * inst.scaleX;
			drawingGroup.properties.radiusY = drawingGroup.properties.radiusY * inst.scaleY;
			var nodesLength = drawingGroup.nodes.length;
			for (k = 0; k < nodesLength; k += 1)
			{
				var currNode = drawingGroup.nodes[k];
				var command = currNode.drawing.command;
				var options = currNode.drawing.options;
				if (drawingGroup.isSimpleDrawing && (command === BEZIER_TO || command === QUADRA_TO))
				{
					command = LINE_TO;
				}
				if (drawingGroup.isSimpleDrawing && (command === ELLIPSE))
				{
					command = ARC;
				}
				//precalculationg control points and radix;
				if (command === BEZIER_TO || command === QUADRA_TO)
				{
					for (var m = 0, length = options.length; m < length; m += 1)
					{
						var currOption = options[m];
						currOption[0] = currOption[0] * inst.scaleX;
						currOption[1] = currOption[1] * inst.scaleY;
					}
				}
				else if (command === ELLIPSE || command === ARC)
				{
					options[0] = options[0] * inst.scaleX;
					options[1] = options[1] * inst.scaleX;
				}
			}
			drawingGroup.nodesLength = drawingGroup.nodes.length;
			//
			if (drawingGroup.properties.strokeGradient)
			{
				drawingGroup.properties.stroke = inst.createGradient(drawingGroup.context, drawingGroup.properties.strokeGradient);
			}
			if (drawingGroup.properties.fillGradient)
			{
				drawingGroup.properties.fill = inst.createGradient(drawingGroup.context, drawingGroup.properties.fillGradient);
			}
		}

		// multi canvas
		if (inst.multiCanvas)
		{
			inst.container = document.createElement('div');
			inst.mainContainer = inst.container;
			inst.container.style.position = 'relative';
			inst.container.className = inst.mainCanvas.className;
			inst.mainCanvas.parentNode.replaceChild(inst.container, inst.mainCanvas);

			for (i = 0; i < inst.drawingGroupsLength; i += 1)
			{
				drawingGroup = inst.drawingGroups[i];
				inst.addLayer(inst.container, drawingGroup.canvas, !drawingGroup.isStatic);
				// if (!container.contains(drawingGroup.canvas)) { container.appendChild(drawingGroup.canvas); }
			}
		}
		inst.draw = inst.multiCanvas ? inst.drawMultiCanvas : inst.drawSingleCanvas;
		//

		//drawingGroups once
		for (i = 0; i < inst.drawingGroupsLength; i += 1)
		{
			drawingGroup = inst.drawingGroups[i];
			inst.drawGroup(drawingGroup, drawingGroup.context);
		}

		if (inst.debug)
		{
			inst.debugCanvas = inst.createCanvas();
			inst.debugContext = inst.debugCanvas.getContext('2d');
			inst.addLayer(inst.multiCanvas ? inst.container : inst.mainCanvas.parentNode, inst.debugCanvas, false);
		}

		if (!inst.multiCanvas) { inst.container = inst.mainCanvas; }

		return inst;
		//caching hard stuff - not interesting performance-wise yet
		// for (i = 0; i < inst.drawingGroupsLength; i += 1)
		// {
		// 	drawingGroup = inst.drawingGroups[i];
		// 	if (drawingGroup.bodyType === 'hard' && !drawingGroup.fixed)
		// 	{
		// 		canvas = inst.createCanvas();
		// 		inst.drawGroup(drawingGroup, canvas.getContext('2d'));
		// 		inst.cachedHard[i] = canvas;
		// 	}
		// }
	},

	addLayer: function ($parent, $canvas, $pointerEvents)
	{
		if ($parent.contains($canvas)) { return; }
		$parent.appendChild($canvas);
		$canvas.style.position = 'absolute';
		$canvas.style.top = this.mainCanvas.offsetTop + 'px';
		$canvas.style.left = this.mainCanvas.offsetLeft + 'px';
		$canvas.style.pointerEvents = $pointerEvents ? 'auto' : 'none';
	},
	createCanvas: function ()
	{
		var canvas = window.document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		canvas.id = Math.random() * 10000000;
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

	createDrawingGroup: function ($group)
	{
		var drawingGroup;
		for (var i = 0, length = this.world.groups.length; i < length; i += 1)
		{
			var currGroup = this.world.groups[i];
			if (!currGroup.drawingGroup) { continue; }
			if (this.compareProperties(currGroup.drawingGroup.properties, $group.drawing.properties) &&
				this.willNotIntersect(currGroup, $group) &&
				!this.isStatic($group) &&
				this.isSimpleDrawing($group) === this.isSimpleDrawing(currGroup))
			{
				drawingGroup = $group.drawingGroup = currGroup.drawingGroup;
			}
		}
		if (!drawingGroup)
		{
			drawingGroup =
			{
				properties: $group.drawing.properties,
				isStatic: this.isStatic($group),
				isSimpleDrawing: this.isSimpleDrawing($group),
				nodes: []
			};
			$group.drawingGroup = drawingGroup;
			this.drawingGroups.push(drawingGroup);
		}
		drawingGroup.nodes = drawingGroup.nodes.concat($group.drawing.nodes);
		return drawingGroup;
	},

	isStatic: function ($group)
	{
		return $group.conf.fixed === true;
	},

	getCollisionGroup: function ($group)
	{
		return $group.conf.physics.bodyType;
	},

	willNotIntersect: function ($groupA, $groupB)
	{
		if ($groupA.conf.physics.bodyType === 'hard' || $groupB.conf.physics.bodyType === 'hard')
		{
			return false;
		}
		return true;
	},
	isSimpleDrawing: function ($group)
	{
		if ($group.conf.physics.bodyType === 'hard' || $group.conf.physics.bodyType === 'soft')
		{
			return true;
		}
		return false;
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

	drawMultiCanvas: function ()
	{
		//this.mainContext.clearRect(0, 0, this.width, this.height);
		var previous;
		for (var i = 0; i < this.dynamicGroupsLength; i += 1)
		{
			var drawingGroup = this.dynamicGroups[i];
			if (previous !== drawingGroup.context) { drawingGroup.context.clearRect(0, 0, this.width, this.height); }
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

	drawGroup: function (drawing, context)
	{
		context.beginPath();

		if (context.fillStyle !== drawing.properties.fill) { context.fillStyle = drawing.properties.fill; }
		if (context.strokeStyle !== drawing.properties.stroke) { context.strokeStyle = drawing.properties.stroke; }
		if (context.lineWidth !== drawing.properties.lineWidth) { context.lineWidth = drawing.properties.lineWidth; }
		if (context.lineCap !== drawing.properties.lineCap) { context.lineCap = drawing.properties.lineCap; }
		if (context.lineJoin !== drawing.properties.lineJoin) { context.lineJoin = drawing.properties.lineJoin; }
		if (context.globalAlpha !== drawing.properties.opacity) { context.globalAlpha = drawing.properties.opacity; }

		//special case for lines with nice dynamic gradients
		if (drawing.properties.dynamicGradient)
		{
			var x1 = drawing.startNode.getX() * this.scaleX;
			var y1 = drawing.startNode.getY() * this.scaleY;
			var x2 = drawing.endNode.getX() * this.scaleX;
			var y2 = drawing.endNode.getY() * this.scaleY;
			var gradient = context.createLinearGradient(x1, y1, x2, y2);
			for (var stopN = 0, stopLength = drawing.strokeGradient.stops.length; stopN < stopLength; stopN += 1)
			{
				gradient.addColorStop(1 - drawing.strokeGradient.stops[stopN].offset, drawing.strokeGradient.stops[stopN].color);
			}
			context.strokeStyle = gradient;
		}
		//

		for (var k = 0; k < drawing.nodesLength; k += 1)
		{
			var currNode = drawing.nodes[k];
			if (currNode.drawing.command === MOVE_TO)
			{
				context.moveTo(currNode.getX() * this.scaleX, currNode.getY() * this.scaleY);
			}
			else if (currNode.drawing.command === LINE_TO)
			{
				context.lineTo(currNode.getX() * this.scaleX, currNode.getY() * this.scaleY);
				continue;
			}
			else if (currNode.drawing.command === ARC)
			{
				context.moveTo(currNode.getX() * this.scaleX, currNode.getY() * this.scaleY);
				context.arc(currNode.getX() * this.scaleX, currNode.getY() * this.scaleY, currNode.drawing.options[0], 0, Math.PI * 2);
			}
			if (!drawing.isSimpleDrawing)
			{
				var options = currNode.drawing.options;
				var baseX = currNode.getX() * this.scaleX;
				var baseY = currNode.getY() * this.scaleY;
				var cp1x;
				var cp1y;

				if (currNode.drawing.command === BEZIER_TO || currNode.drawing.command === QUADRA_TO)
				{
					cp1x = baseX + options[0][0];
					cp1y = baseY + options[0][1];
				}

				if (currNode.drawing.command === BEZIER_TO)
				{
					var cp2x = baseX + options[1][0];
					var cp2y = baseY + options[1][1];
					context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, baseX, baseY);
					//context.lineTo(baseX, baseY);
				}
				else if (currNode.drawing.command === QUADRA_TO)
				{
					context.quadraticCurveTo(cp1x, cp1y, baseX, baseY);
				}
				else if (currNode.drawing.command === MOVE_TO)
				{
					context.moveTo(currNode.getX() * this.scaleX, currNode.getY() * this.scaleY);
				}
				else if (currNode.drawing.command === ELLIPSE)
				{
					context.moveTo(currNode.getX() * this.scaleX, currNode.getY() * this.scaleY);
					context.ellipse(currNode.getX() * this.scaleX, currNode.getY() * this.scaleY, currNode.drawing.options[0], currNode.drawing.options[1], currNode.drawing.options[2], 0, Math.PI * 2);
				}
			}
		}

		if (drawing.properties.closePath) { context.closePath(); }
		if (drawing.properties.fill !== 'none') { context.fill(); }
		if (drawing.properties.stroke !== 'none') { context.stroke(); }
		if (drawing.properties.opacity !== 1) { context.globalAlpha = 1; }
	},

	debugDraw: function ($clear)
	{
		if ($clear !== undefined) { this.debugContext.clearRect(0, 0, this.width, this.height); }

		this.debugContext.strokeStyle = 'rgba(255,255,1,1)';
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
				this.debugContext.moveTo(currNode.getX() * this.scaleX, currNode.getY() * this.scaleY);
				var radius = currGroup.structure.innerRadius * this.scaleX || currGroup.structure.radiusX * this.scaleX || currGroup.conf.physics.nodeRadius * this.scaleX || 1;
				this.debugContext.arc(currNode.getX() * this.scaleX, currNode.getY() * this.scaleY, radius, 0, Math.PI * 2);
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
				this.debugContext.moveTo(currJoint.node1.getX() * this.scaleX, currJoint.node1.getY() * this.scaleY);
				this.debugContext.lineTo(currJoint.node2.getX() * this.scaleX, currJoint.node2.getY() * this.scaleY);
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

