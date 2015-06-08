var SVJellyRenderer = function ($world, $canvas)
{
	this.canvas = $canvas;
	this.world = $world;
	this.context = this.canvas.getContext('2d');
	this.debug = $world.conf.debug;

	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.drawScaleX = this.drawScaleY = this.canvas.width / this.world.getWidth();

	this.drawingGroups = [];
	for (var k = 0, groupsLength = this.world.groupsArray.length; k < groupsLength; k += 1)
	{
		var currGroup = this.world.groupsArray[k];

		for (var i = 0, nodesLength = currGroup.nodes.length; i < nodesLength; i += 1)
		{
			var currNode = currGroup.nodes[i];
			var drawingGroup;
			if (currNode.drawing)
			{
				if (currNode.drawing.fill || currNode.drawing.stroke)// && !currNode.drawing.notToDraw)
				{
					drawingGroup = { properties: currNode.drawing, nodes: [], type: currGroup.type };
					this.drawingGroups.push(drawingGroup);
				}
				drawingGroup.nodes.push(currNode);
			}
		}
	}
	this.drawingGroupLength = this.drawingGroups.length;
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
	for (var i = 0; i < this.drawingGroupLength; i += 1)
	{
		var drawingGroup = this.drawingGroups[i];
		var nodesLength = drawingGroup.nodes.length;
		this.context.beginPath();

		if (drawingGroup.properties.fill !== 'none') { this.context.fillStyle = drawingGroup.properties.fill; }
		if (drawingGroup.properties.stroke !== 'none') { this.context.strokeStyle = drawingGroup.properties.stroke; }
		if (drawingGroup.properties.lineWidth !== 'none') { this.context.lineWidth = drawingGroup.properties.lineWidth * this.drawScaleX; }
		if (drawingGroup.properties.lineCap) { this.context.lineCap = drawingGroup.properties.lineCap; }
		if (drawingGroup.properties.lineJoin) { this.context.lineJoin = drawingGroup.properties.lineJoin; }
		this.context.globalAlpha = drawingGroup.properties.opacity ? drawingGroup.properties.opacity : 1;

		for (var k = 0; k < nodesLength; k += 1)
		{
			var currNode = drawingGroup.nodes[k];
			if (currNode.drawing && currNode.drawing.notToDraw) { continue; }
			if (currNode.isStart)
			{
				//gradient
				if (drawingGroup.properties.strokeGradient !== 'none')
				{
					var x1 = currNode.getX() * this.drawScaleX;
					var y1 = currNode.getY() * this.drawScaleY;
					var x2 = currNode.endNode.getX() * this.drawScaleX;
					var y2 = currNode.endNode.getY() * this.drawScaleY;
					var gradient = this.context.createLinearGradient(x1, y1, x2, y2);
					for (var stopN = 0, stopLength = currNode.drawing.strokeGradient.length; stopN < stopLength; stopN += 1)
					{
						gradient.addColorStop(1 - currNode.drawing.strokeGradient[stopN].offset, currNode.drawing.strokeGradient[stopN].color);
					}
					this.context.strokeStyle = gradient;
				}
				//

				this.context.moveTo(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY);
			}
			else
			{
				this.context.lineTo(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY);
			}
			// this.context.moveTo(currNode.getX() * this.drawScaleX, this.height - currNode.getY() * this.drawScaleY);
			// this.context.arc(currNode.getX() * this.drawScaleX, this.height - currNode.getY() * this.drawScaleY, 2, 0, Math.PI * 2);
		}
		if (drawingGroup.type !== 'line') { this.context.closePath(); }
		if (drawingGroup.properties.fill !== 'none') { this.context.fill(); }
		if (drawingGroup.properties.stroke !== 'none' || drawingGroup.properties.strokeGradient !== 'none') { this.context.stroke(); }
	}

	if (this.debug) { this.debugDraw(); }
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
			this.context.arc(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY, currGroup.physicsManager.nodesDiameter * this.drawScaleX, 0, Math.PI * 2);
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
};

module.exports = SVJellyRenderer;

