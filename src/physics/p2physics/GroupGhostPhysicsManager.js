var HardDecorationDrawing = require('./HardDecorationDrawing');

var GroupGhostPhysicsManager = function ($group)
{
	this.group = $group;
	this._boundingBox = undefined;
	this._position = [];
	var self = this;
	this.nodesAddedPromise = new window.Promise(function (resolve) { self.resolveNodesAdded = resolve; });
};

GroupGhostPhysicsManager.prototype.getNodePhysicsManager = function ($node)
{
	var manager = {};
	var getX = function ($nodeOX) { return function () { return $nodeOX; }; };
	var getY = function ($nodeOY) { return function () { return $nodeOY; }; };
	for (var i = 0, length = this.group.nodes.length; i < length; i += 1)
	{
		manager.getX = getX($node.oX);
		manager.getY = getY($node.oY);
	}
	return manager;
};

GroupGhostPhysicsManager.prototype.getDecorationDrawing = function ()
{
	return HardDecorationDrawing.create(this.group);
};

GroupGhostPhysicsManager.prototype.getBoundingBox = function ()
{
	if (!this._boundingBox)
	{
		var minX = Infinity;
		var minY = Infinity;
		var maxX = -Infinity;
		var maxY = -Infinity;
		for (var i = 0, length = this.group.nodesLength; i < length; i += 1)
		{
			var currNode = this.group.nodes[i];
			minX = Math.min(currNode.physicsManager.getX(), minX);
			minY = Math.min(currNode.physicsManager.getY(), minY);
			maxX = Math.min(currNode.physicsManager.getX(), maxX);
			maxY = Math.min(currNode.physicsManager.getY(), maxY);
		}
		this._boundingBox = [[minX, minY], [maxX, maxY]];
	}
	return this._boundingBox;
};

GroupGhostPhysicsManager.prototype.addJointsToWorld = function ()
{
	return null;
};

GroupGhostPhysicsManager.prototype.getAngle = function () { return 0; };
GroupGhostPhysicsManager.prototype.getX = function () { return 0; };
GroupGhostPhysicsManager.prototype.getY = function () { return 0; };

GroupGhostPhysicsManager.prototype.getBoundingBox = function ()
{
	if (!this._boundingBox)
	{
		var minX = Infinity;
		var minY = Infinity;
		var maxX = -Infinity;
		var maxY = -Infinity;
		for (var i = 0, length = this.group.nodesLength; i < length; i += 1)
		{
			var currNode = this.group.nodes[i];
			minX = Math.min(currNode.physicsManager.getX(), minX);
			minY = Math.min(currNode.physicsManager.getY(), minY);
			maxX = Math.max(currNode.physicsManager.getX(), maxX);
			maxY = Math.max(currNode.physicsManager.getY(), maxY);
		}

		this._boundingBox = [[minX, minY], [maxX, maxY]];
	}
	return this._boundingBox;
};

GroupGhostPhysicsManager.prototype.addNodesToWorld = function ()
{
	this.resolveNodesAdded();
};

module.exports = GroupGhostPhysicsManager;

