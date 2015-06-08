var GroupGhostPhysicsManager = function ($group)
{
	this.group = $group;
};

GroupGhostPhysicsManager.prototype.addJointsToWorld = function ()
{
	return null;
};

GroupGhostPhysicsManager.prototype.addNodesToWorld = function ()
{
	var getX = function ($nodeOX) { return function () { return $nodeOX; }; };
	var getY = function ($nodeOY) { return function () { return $nodeOY; }; };
	for (var i = 0, length = this.group.nodes.length; i < length; i += 1)
	{
		var node = this.group.nodes[i];
		var manager = {};
		manager.getX = getX(node.oX);
		manager.getY = getY(node.oY);
		node.physicsManager = manager;
	}
};

module.exports = GroupGhostPhysicsManager;

