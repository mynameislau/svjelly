var AnchorP2HardPhysicsManager = function ($group) { this.group = $group; };

AnchorP2HardPhysicsManager.prototype.setFromPoint = function ($closestPoint)
{
	this.body = this.group.physicsManager.body;
	this.worldHeight = this.group.physicsManager.worldHeight;
	this.closestPoint = $closestPoint;
	this.offset = [$closestPoint[0] - this.body.position[0], (this.worldHeight - $closestPoint[1]) - this.body.position[1]];
	var dX = this.offset[0];
	var dY = this.offset[1];
	this.angle = Math.atan2(dY, dX);
	this.hyp = Math.sqrt(dX * dX + dY * dY);
};

AnchorP2HardPhysicsManager.prototype.setFromPoints = function ($points)
{
	var closestDist = Infinity;
	var closestPoint;
	var closestNode;
	var closestOffsetX;
	var closestOffsetY;

	for (var i = 0, length = $points.length; i < length; i += 1)
	{
		var currPoint = $points[i];
		for (var k = 0, nodesLength = this.group.nodes.length; k < nodesLength; k += 1)
		{
			var currNode = this.group.nodes[k];
			var offsetX = currPoint[0] - currNode.oX;
			var offsetY = currPoint[1] - currNode.oY;
			var cX = Math.abs(offsetX);
			var cY = Math.abs(offsetY);
			var dist = Math.sqrt(cX * cX + cY * cY);
			if (dist < closestDist)
			{
				closestNode = currNode;
				closestPoint = currPoint;
				closestDist = dist;
				closestOffsetX = offsetX;
				closestOffsetY = offsetY;
			}
		}
	}

	this.body = this.group.physicsManager.body;
	this.worldHeight = this.group.physicsManager.worldHeight;
	this.closestPoint = closestPoint;
	this.offset = [closestPoint[0] - this.body.position[0], (this.worldHeight - closestPoint[1]) - this.body.position[1]];
	//$anchor.setup(this.body, closestPoint);

	//return { node: closestNode, point: closestPoint, offset: [this.body.position[0] - closestPoint[0], this.body.position[1] - closestPoint[1]] };
	var dX = this.offset[0];
	var dY = this.offset[1];
	this.angle = Math.atan2(dY, dX);
	this.hyp = Math.sqrt(dX * dX + dY * dY);
};

AnchorP2HardPhysicsManager.prototype.getX = function ()
{
	return this.body.position[0] + this.hyp * Math.cos(this.body.angle + this.angle);
};

AnchorP2HardPhysicsManager.prototype.getY = function ()
{
	return this.worldHeight - (this.body.position[1] + this.hyp * Math.sin(this.body.angle + this.angle));
};

module.exports = AnchorP2HardPhysicsManager;
