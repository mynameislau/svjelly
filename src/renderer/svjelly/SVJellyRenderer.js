var SVJellyRenderer = function ($world, $canvas)
{
	this.mainCanvas = $canvas;
	this.world = $world;
	this.context = this.mainCanvas.getContext('2d');
	this.debug = $world.conf.debug;
	this.cachedStatic = [];
	this.cachedHard = [];

	this.width = this.mainCanvas.width;
	this.height = this.mainCanvas.height;
	this.drawScaleX = this.drawScaleY = this.mainCanvas.width / this.world.getWidth();

	this.drawingGroups = [];
	var k = 0;
	var i;
	for (var groupsLength = this.world.groups.length; k < groupsLength; k += 1)
	{
		var currGroup = this.world.groups[k];
		this.createDrawingGroup(currGroup);
	}
	this.drawingGroupLength = this.drawingGroups.length;

	var drawingGroup;

	//caching gradients and precalculating
	for (i = 0; i < this.drawingGroupLength; i += 1)
	{
		drawingGroup = this.drawingGroups[i];
		//precalculating some instructions
		drawingGroup.properties.lineWidth = drawingGroup.properties.lineWidth * this.drawScaleX;
		drawingGroup.properties.radiusX = drawingGroup.properties.radiusX * this.drawScaleX;
		drawingGroup.properties.radiusY = drawingGroup.properties.radiusY * this.drawScaleY;
		drawingGroup.nodesLength = drawingGroup.nodes.length;
		//
		if (drawingGroup.properties.strokeGradient)
		{
			drawingGroup.properties.stroke = this.createGradient(drawingGroup.properties.strokeGradient);
		}
		if (drawingGroup.properties.fillGradient)
		{
			drawingGroup.properties.fill = this.createGradient(drawingGroup.properties.fillGradient);
		}
	}

	//caching ghosts
	i = 0;
	var previousDrawingGroup;
	var canvas;
	for (i; i < this.drawingGroupLength; i += 1)
	{
		drawingGroup = this.drawingGroups[i];
		if (drawingGroup.bodyType === 'ghost' || drawingGroup.fixed === true)
		{
			//if some ghost layers are on top of each other, no need to create
			//a new canvas, you can just draw the layers on the same one
			canvas = this.cachedStatic[i - 1] || this.createCanvas();
			this.drawGroup(drawingGroup, canvas.getContext('2d'));
			this.cachedStatic[i] = canvas;
		}
		previousDrawingGroup = drawingGroup;
	}

	//caching hard stuff - not interesting performance-wise yet
	// for (i = 0; i < this.drawingGroupLength; i += 1)
	// {
	// 	drawingGroup = this.drawingGroups[i];
	// 	if (drawingGroup.bodyType === 'hard' && !drawingGroup.fixed)
	// 	{
	// 		canvas = this.createCanvas();
	// 		this.drawGroup(drawingGroup, canvas.getContext('2d'));
	// 		this.cachedHard[i] = canvas;
	// 	}
	// }
};

SVJellyRenderer.prototype.createCanvas = function ()
{
	var canvas = window.document.createElement('canvas');
	canvas.width = this.width;
	canvas.height = this.height;
	return canvas;
};

SVJellyRenderer.prototype.createGradient = function ($properties)
{
	var x1 = $properties.x1 * this.drawScaleX;
	var y1 = $properties.y1 * this.drawScaleY;
	var x2 = $properties.x2 * this.drawScaleX;
	var y2 = $properties.y2 * this.drawScaleY;

	var cx = $properties.cx * this.drawScaleX;
	var cy = $properties.cy * this.drawScaleY;
	var fx = $properties.fx * this.drawScaleX || cx;
	var fy = $properties.fy * this.drawScaleY || cy;
	var r = $properties.r * this.drawScaleX;

	var gradient = $properties.type === 'linearGradient' ? this.context.createLinearGradient(x1, y1, x2, y2) : this.context.createRadialGradient(cx, cy, 0, fx, fy, r);

	for (var stopN = 0, stopLength = $properties.stops.length; stopN < stopLength; stopN += 1)
	{
		gradient.addColorStop($properties.stops[stopN].offset, $properties.stops[stopN].color);
	}

	return gradient;
};

SVJellyRenderer.prototype.createDrawingGroup = function ($group)
{
	var drawingGroup;
	//optim same drawing styles
	for (var i = 0, length = this.drawingGroups.length; i < length; i += 1)
	{
		var currDrawingGroup = this.drawingGroups[i];
		if (this.compareProperties(currDrawingGroup.properties, $group.drawing.properties) &&
			$group.conf.physics.bodyType === 'hard' &&
			currDrawingGroup.bodyType === 'hard' &&
			currDrawingGroup.fixed === false &&
			$group.conf.fixed === false)
		{
			drawingGroup = currDrawingGroup;
		}
	}

	if (!drawingGroup)
	{
		drawingGroup =
		{
			properties: $group.drawing.properties,
			bodyType: $group.conf.physics.bodyType,
			fixed: $group.conf.fixed,
			nodes: $group.drawing.nodes
		};
		this.drawingGroups.push(drawingGroup);
	}

	drawingGroup.nodes = drawingGroup.nodes.concat($group.drawing.nodes);
	return drawingGroup;
};

SVJellyRenderer.prototype.compareProperties = function ($one, $two)
{
	var comparison = true;
	for (var name in $two)
	{
		if ($one[name] !== $two[name]) { comparison = false; }
	}
	return comparison;
};

SVJellyRenderer.prototype.draw = function ()
{
	this.context.clearRect(0, 0, this.width, this.height);
	//this.context.miterLimit = 1;
	var previousCached;
	for (var i = 0; i < this.drawingGroupLength; i += 1)
	{
		var drawingGroup = this.drawingGroups[i];
		if (this.cachedStatic[i] && this.cachedStatic[i] !== previousCached)
		{
			this.context.drawImage(this.cachedStatic[i], 0, 0);
		}
		// else if (this.cachedHard[i])
		// {
		// 	this.context.drawImage(this.cachedHard[i], 0, 0);
		// }
		else
		{
			this.drawGroup(drawingGroup, this.context);
		}
		previousCached = this.cachedStatic[i];
	}

	if (this.debug) { this.debugDraw(); }
};

SVJellyRenderer.prototype.drawGroup = function (drawing, context)
{
	context.beginPath();

	if (context.fillStyle !== drawing.properties.fill) { context.fillStyle = drawing.properties.fill; }
	if (context.strokeStyle !== drawing.properties.stroke) { context.strokeStyle = drawing.properties.stroke; }
	if (context.lineWidth !== drawing.properties.lineWidth) { context.lineWidth = drawing.properties.lineWidth; }
	if (context.lineCap !== drawing.properties.lineCap) { context.lineCap = drawing.properties.lineCap; }
	if (context.lineJoin !== drawing.properties.lineJoin) { context.lineJoin = drawing.properties.lineJoin; }
	if (context.globalAlpha !== drawing.properties.opacity) { context.globalAlpha = drawing.properties.opacity; }

	for (var k = 0; k < drawing.nodesLength; k += 1)
	{
		var currNode = drawing.nodes[k];
		if (currNode.drawing.isStart)
		{
			//special case for lines with nice dynamic gradients
			if (drawing.properties.dynamicGradient)
			{
				var x1 = currNode.getX() * this.drawScaleX;
				var y1 = currNode.getY() * this.drawScaleY;
				var x2 = currNode.endNode.getX() * this.drawScaleX;
				var y2 = currNode.endNode.getY() * this.drawScaleY;
				var gradient = context.createLinearGradient(x1, y1, x2, y2);
				for (var stopN = 0, stopLength = currNode.drawing.strokeGradient.length; stopN < stopLength; stopN += 1)
				{
					gradient.addColorStop(1 - currNode.drawing.strokeGradient[stopN].offset, currNode.drawing.strokeGradient[stopN].color);
				}
				context.strokeStyle = gradient;
			}
			//

			context.moveTo(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY);
			if (drawing.properties.radiusX)
			{
				context.arc(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY, drawing.properties.radiusX, 0, Math.PI * 2);
			}
		}
		else
		{
			if (currNode.drawing.command === 'bezierCurveTo')
			{
				var options = currNode.drawing.options;
				var baseX = currNode.getX() * this.drawScaleX;
				var baseY = currNode.getY() * this.drawScaleY;
				var cp1x = baseX + options[0][0] * this.drawScaleX;
				var cp1y = baseY + options[0][1] * this.drawScaleY;
				var cp2x = baseX + options[1][0] * this.drawScaleX;
				var cp2y = baseY + options[1][1] * this.drawScaleY;
				context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, baseX, baseY);
				console.log(options[0][0], options[0][1], options[1][0], options[1][1]);
				console.log(cp1x, cp1y, cp2x, cp2y, baseX, baseY);
				//context.lineTo(baseX, baseY);
			}
			else { context.lineTo(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY); }
		}
	}
	if (drawing.properties.closePath) { context.closePath(); }
	if (drawing.properties.fill !== 'none') { context.fill(); }
	if (drawing.properties.stroke !== 'none') { context.stroke(); }
};

SVJellyRenderer.prototype.debugDraw = function ($clear)
{
	if ($clear !== undefined) { this.context.clearRect(0, 0, this.width, this.height); }

	this.context.strokeStyle = 'rgba(255,255,1,1)';
	this.context.lineCap = 'butt';
	this.context.lineJoin = 'miter';
	this.context.lineWidth = 1;
	this.context.beginPath();
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
			this.context.moveTo(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY);
			var radius = currGroup.structure.radiusX || currGroup.conf.physics.nodeRadius;
			radius *= this.drawScaleX;
			this.context.arc(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY, radius, 0, Math.PI * 2);
		}
	}
	this.context.stroke();

	this.context.strokeStyle = 'rgba(255,1,1,1)';
	this.context.beginPath();
	for (k = 0; k < groupsLength; k += 1)
	{
		currGroup = this.world.groups[k];
		var jointsLength = currGroup.joints.length;

		for (i = 0; i < jointsLength; i += 1)
		{
			var currJoint = currGroup.joints[i];
			this.context.moveTo(currJoint.node1.getX() * this.drawScaleX, currJoint.node1.getY() * this.drawScaleY);
			this.context.lineTo(currJoint.node2.getX() * this.drawScaleX, currJoint.node2.getY() * this.drawScaleY);
		}
	}
	this.context.stroke();

	this.context.strokeStyle = 'blue';
	this.context.beginPath();
	var length = this.world.groupConstraints.length;
	for (k = 0; k < length; k += 1)
	{
		var currLock = this.world.groupConstraints[k];
		this.context.moveTo(currLock.anchorA.getX() * this.drawScaleX, currLock.anchorA.getY() * this.drawScaleY);
		this.context.lineTo(currLock.anchorB.getX() * this.drawScaleX, currLock.anchorB.getY() * this.drawScaleY);
	}
	this.context.stroke();

	this.context.fillStyle = 'black';
	for (k = 0; k < groupsLength; k += 1)
	{
		var group = this.world.groups[k];
		nodesLength = group.nodes.length;
		for (i = 0; i < nodesLength; i += 1)
		{
			var node = group.nodes[i];
			if (node.debugText) { this.context.fillText(node.debugText, node.getX() * this.drawScaleX, node.getY() * this.drawScaleY); }
		}
	}
};

module.exports = SVJellyRenderer;

