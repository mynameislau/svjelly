var AnchorP2GhostPhysicsManager = function ($p2, $p2World, $worldHeight)
{
	this.p2 = $p2;
	this.p2World = $p2World;
	this.offset = [0, 0];
	this.worldHeight = $worldHeight;
};

AnchorP2GhostPhysicsManager.prototype.setFromPoint = function ($point)
{
	this.point = $point;
};

AnchorP2GhostPhysicsManager.prototype.addToWorld = function ()
{
	this.body = new this.p2.Body({
		position: [this.point[0], this.worldHeight - this.point[1]]
	});
	this.p2World.addBody(this.body);
};

AnchorP2GhostPhysicsManager.prototype.getX = function ()
{
	return this.body.position[0];
};

AnchorP2GhostPhysicsManager.prototype.getY = function ()
{
	return this.worldHeight - this.body.position[1];
};

module.exports = AnchorP2GhostPhysicsManager;
