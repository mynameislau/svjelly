var GhostNodePhysicsManager = function ($p2World, $node)
{
	this.body = new this.p2.Body();
	this.body.position = [$node.oX, $node.oY];
	$p2World.addBody(this.body);
};

module.exports = GhostNodePhysicsManager;
