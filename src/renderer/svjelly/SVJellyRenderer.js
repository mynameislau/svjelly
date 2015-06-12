var SVJellyRenderer = function ($world, $canvas)
{
	this.canvas = $canvas;
	this.world = $world;
	this.context = this.canvas.getContext('2d');
	this.debug = $world.conf.debug;
	this.cached = [];

	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.drawScaleX = this.drawScaleY = this.canvas.width / this.world.getWidth();

	this.drawingGroups = [];
	var k = 0;
	var i;
	var drawingGroup;
	for (var groupsLength = this.world.groupsArray.length; k < groupsLength; k += 1)
	{
		var currGroup = this.world.groupsArray[k];

		i = 0;
		for (var nodesLength = currGroup.nodes.length; i < nodesLength; i += 1)
		{
			var currNode = currGroup.nodes[i];
			if (currNode.drawing)
			{
				if (currNode.drawing.fill || currNode.drawing.stroke)// && !currNode.drawing.notToDraw)
				{
					drawingGroup =
					{
						properties: currNode.drawing,
						nodes: [],
						type: currGroup.type,
						structure: currGroup.conf.structure,
						fixed: currGroup.conf.fixed
					};
					this.drawingGroups.push(drawingGroup);
				}
				drawingGroup.nodes.push(currNode);
			}
		}
	}
	this.drawingGroupLength = this.drawingGroups.length;

	//caching gradients
	for (i = 0; i < this.drawingGroupLength; i += 1)
	{
		drawingGroup = this.drawingGroups[i];
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
	for (i; i < this.drawingGroupLength; i += 1)
	{
		drawingGroup = this.drawingGroups[i];
		if (drawingGroup.type === 'ghost' || drawingGroup.fixed === true)
		{
			var canvas;
			if (this.cached[i - 1] === undefined)
			{
				canvas = window.document.createElement('canvas');
				canvas.width = this.width;
				canvas.height = this.height;
			}
			else
			{
				//if some ghost layers are on top of each other, no need to create
				//a new canvas, you can just draw the layers on the same one
				canvas = this.cached[i - 1];
			}

			var context = canvas.getContext('2d');
			this.drawGroup(drawingGroup, context);
			this.cached[i] = canvas;
		}
		previousDrawingGroup = drawingGroup;
	}
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

	//gradient = this.context.createLinearGradient(0, 0, 500, 500);

	for (var stopN = 0, stopLength = $properties.stops.length; stopN < stopLength; stopN += 1)
	{
		gradient.addColorStop($properties.stops[stopN].offset, $properties.stops[stopN].color);
	}

	// var gueugueu = this.context.createLinearGradient(0, 0, 500, 500);
	// gueugueu.addColorStop(0, 'red');
	// gueugueu.addColorStop(1, 'blue');
	return gradient;
};

SVJellyRenderer.prototype.getDrawingGroup = function ($comparison)
{
	for (var i = 0, length = this.drawingGroups.length; i < length; i += 1)
	{
		var currGroup = this.drawingGroups[i];
		if (this.compareProperties(currGroup.properties, $comparison)) { return currGroup; }
	}
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
	this.context.miterLimit = 1;
	var previousCached;
	for (var i = 0; i < this.drawingGroupLength; i += 1)
	{
		var drawingGroup = this.drawingGroups[i];
		if (this.cached[i] && this.cached[i] !== previousCached)
		{
			this.context.drawImage(this.cached[i], 0, 0);
		}
		else
		{
			this.drawGroup(drawingGroup, this.context);
		}
		previousCached = this.cached[i];
	}

	if (this.debug) { this.debugDraw(); }
};

SVJellyRenderer.prototype.drawGroup = function ($drawingGroup, $context)
{
	var nodesLength = $drawingGroup.nodes.length;
	$context.beginPath();

	// console.log($context.fillStyle, $context.strokeStyle);
	// console.log($drawingGroup.properties.fill, $drawingGroup.properties.stroke);
	// debugger;

	// if ($drawingGroup.properties.fill !== 'none') { $context.fillStyle = $drawingGroup.properties.fill; }
	// if ($drawingGroup.properties.stroke !== 'none') { $context.strokeStyle = $drawingGroup.properties.stroke; }
	if ($context.fillStyle !== $drawingGroup.properties.fill) { $context.fillStyle = $drawingGroup.properties.fill; }
	if ($context.strokeStyle !== $drawingGroup.properties.stroke) { $context.strokeStyle = $drawingGroup.properties.stroke; }

	if ($drawingGroup.properties.lineWidth !== 'none') { $context.lineWidth = $drawingGroup.properties.lineWidth * this.drawScaleX; }
	if ($drawingGroup.properties.lineCap) { $context.lineCap = $drawingGroup.properties.lineCap; }
	if ($drawingGroup.properties.lineJoin) { $context.lineJoin = $drawingGroup.properties.lineJoin; }
	$context.globalAlpha = $drawingGroup.properties.opacity ? $drawingGroup.properties.opacity : 1;

	for (var k = 0; k < nodesLength; k += 1)
	{
		var currNode = $drawingGroup.nodes[k];
		if (currNode.drawing && currNode.drawing.notToDraw) { continue; }
		if (currNode.isStart)
		{
			//line gradient
			if ($drawingGroup.type === 'line' && $drawingGroup.properties.strokeGradient)
			{
				var x1 = currNode.getX() * this.drawScaleX;
				var y1 = currNode.getY() * this.drawScaleY;
				var x2 = currNode.endNode.getX() * this.drawScaleX;
				var y2 = currNode.endNode.getY() * this.drawScaleY;
				var gradient = $context.createLinearGradient(x1, y1, x2, y2);
				for (var stopN = 0, stopLength = currNode.drawing.strokeGradient.length; stopN < stopLength; stopN += 1)
				{
					gradient.addColorStop(1 - currNode.drawing.strokeGradient[stopN].offset, currNode.drawing.strokeGradient[stopN].color);
				}
				$context.strokeStyle = gradient;
			}
			//

			$context.moveTo(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY);
			if ($drawingGroup.properties.radius)
			{
				$context.arc(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY, $drawingGroup.properties.radius, 0, Math.PI * 2);
			}
		}
		else
		{
			$context.lineTo(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY);
		}
		// $context.moveTo(currNode.getX() * this.drawScaleX, this.height - currNode.getY() * this.drawScaleY);
		// $context.arc(currNode.getX() * this.drawScaleX, this.height - currNode.getY() * this.drawScaleY, 2, 0, Math.PI * 2);
	}
	if ($drawingGroup.properties.closePath) { $context.closePath(); }
	if ($drawingGroup.properties.fill !== 'none') { $context.fill(); }
	if ($drawingGroup.properties.stroke !== 'none') { $context.stroke(); }
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
	var groupsLength = this.world.groupsArray.length;
	for (k = 0; k < groupsLength; k += 1)
	{
		currGroup = this.world.groupsArray[k];

		var nodesLength = currGroup.nodes.length;
		for (i = 0; i < nodesLength; i += 1)
		{
			var currNode = currGroup.nodes[i];
			this.context.moveTo(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY);
			this.context.arc(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY, currGroup.conf.physics.nodeRadius * this.drawScaleX, 0, Math.PI * 2);
		}
	}
	this.context.stroke();

	this.context.strokeStyle = 'rgba(255,1,1,1)';
	this.context.beginPath();
	for (k = 0; k < groupsLength; k += 1)
	{
		currGroup = this.world.groupsArray[k];
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
};

module.exports = SVJellyRenderer;

