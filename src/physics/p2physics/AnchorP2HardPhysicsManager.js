var AnchorP2HardPhysicsManager = function ($group) { this.group = $group; };

AnchorP2HardPhysicsManager.prototype.setFromPoint = function ($point)
{
	this.point = $point;
};

AnchorP2HardPhysicsManager.prototype.addToWorld = function ()
{
	this.body = this.group.physicsManager.body;
	this.worldHeight = this.group.physicsManager.worldHeight;
	this.offset = [this.point[0] - this.body.position[0], (this.worldHeight - this.point[1]) - this.body.position[1]];
	var dX = this.offset[0];
	var dY = this.offset[1];
	this.angle = Math.atan2(dY, dX);
	this.hyp = Math.sqrt(dX * dX + dY * dY);
};

AnchorP2HardPhysicsManager.prototype.setFixed = function ($fixed)
{
	this.group.fixed = $fixed;
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
