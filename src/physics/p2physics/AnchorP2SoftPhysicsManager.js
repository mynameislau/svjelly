var AnchorP2SoftPhysicsManager = function ($group) { this.group = $group; };

AnchorP2SoftPhysicsManager.prototype.setFromPoint = function ($point)
{
	this.point = $point;
	this.node = this.group.getClosestNode($point);
	this.worldHeight = this.group.physicsManager.worldHeight;
	this.offset = [0, 0];
};

AnchorP2SoftPhysicsManager.prototype.addToWorld = function ()
{
	this.body = this.node.physicsManager.body;
};

AnchorP2SoftPhysicsManager.prototype.setFixed = function ($fixed)
{
	this.node.fixed = $fixed;
};

AnchorP2SoftPhysicsManager.prototype.getX = function ()
{
	return this.body.interpolatedPosition[0];
};

AnchorP2SoftPhysicsManager.prototype.getY = function ()
{
	return this.worldHeight - this.body.interpolatedPosition[1];
};

module.exports = AnchorP2SoftPhysicsManager;
