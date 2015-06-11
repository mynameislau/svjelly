var AnchorP2HardPhysicsManager = function ($group) { this.group = $group; };

AnchorP2HardPhysicsManager.prototype.setFromPoint = function ($closestPoint)
{
	var closestNode = this.group.getClosestNode($closestPoint);
	this.body = closestNode.physicsManager.body;
	this.closestPoint = $closestPoint;
	this.worldHeight = this.group.physicsManager.worldHeight;
	this.offset = [0, 0];
};

AnchorP2HardPhysicsManager.prototype.getX = function ()
{
	return this.body.position[0];
};

AnchorP2HardPhysicsManager.prototype.getY = function ()
{
	return this.worldHeight - this.body.position[1];
};

module.exports = AnchorP2HardPhysicsManager;
