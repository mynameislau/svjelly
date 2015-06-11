var SVJellyGroup = require('./SVJellyGroup');
var Structure = require('./Structure');

var SVJellyWorld = function ($physicsManager, $conf)
{
	this.physicsManager = $physicsManager;
	this.groupsArray = [];
	this.conf = $conf;
	this.worldNodes = [];
	this.toConstrain = [];
	this.groupConstraints = [];
	this.worldWidth = this.physicsManager.worldWidth = $conf.worldWidth;
};

SVJellyWorld.prototype.setHeight = function ($height)
{
	this.worldHeight = this.physicsManager.worldHeight = $height;
};

SVJellyWorld.prototype.getWidth = function ()
{
	return this.worldWidth;
};

SVJellyWorld.prototype.getGroupByID = function ($ID)
{
	for (var i = 0, length = this.groupsArray.length; i < length; i += 1)
	{
		var currGroup = this.groupsArray[i];
		if (currGroup.ID === $ID) { return currGroup; }
	}
};

SVJellyWorld.prototype.createGroup = function ($type, $ID)
{
	var type = $type || 'default';
	var group = new SVJellyGroup(type, this.conf.groups[type], $ID);
	group.physicsManager = this.physicsManager.getGroupPhysicsManager(group);
	group.structure = new Structure(group, this);
	this.groupsArray.push(group);
	return group;
};

SVJellyWorld.prototype.constrainGroups = function ($groupA, $groupB, $points)
{
	this.toConstrain.push({ groupA: $groupA, groupB: $groupB, points: $points });
};

SVJellyWorld.prototype.addConstraintToWorld = function ($toConstrain)
{
	var curr = $toConstrain;
	var points = curr.points;
	var groupA = curr.groupA;
	var groupB = curr.groupB;

	var closestPointA = groupA.getClosestPoint(points);
	if (points.length < 3)
	{
		var anchorA = this.physicsManager.getAnchorPhysicsManager(groupA);
		var anchorB = this.physicsManager.getAnchorPhysicsManager(groupB);
		anchorA.setFromPoint(closestPointA);
		points.splice(points.indexOf(closestPointA), 1);
		anchorB.setFromPoint(points[0]);
		this.physicsManager.constrainGroups(anchorA, anchorB);
		this.groupConstraints.push({ anchorA: anchorA, anchorB: anchorB });
	}
	else
	{
		var ANodes = groupA.getNodesInside(points);
		for (var i = 0, nodesLength = ANodes.length; i < nodesLength; i += 1)
		{
			var currANode = ANodes[i];
			if (!groupB)
			{
				currANode.setFixed(true);
			}
			else
			{
				var currAnchorA = this.physicsManager.getAnchorPhysicsManager(groupA);
				currAnchorA.setFromPoint([currANode.oX, currANode.oY]);
				var currAnchorB = this.physicsManager.getAnchorPhysicsManager(groupB);
				var BNodes = groupB.getNodesInside(points);
				var closestBNode = groupB.getClosestNode([currANode.oX, currANode.oY], BNodes);
				if (closestBNode)
				{
					currAnchorB.setFromPoint([closestBNode.oX, closestBNode.oY]);
					this.physicsManager.constrainGroups(currAnchorA, currAnchorB);
					this.groupConstraints.push({ anchorA: currAnchorA, anchorB: currAnchorB });
				}
				else
				{
					console.warn('constraint problem');
				}
			}
		}
	}
};

SVJellyWorld.prototype.addGroupsToWorld = function ()
{
	for (var i = 0, groupsArrayLength = this.groupsArray.length; i < groupsArrayLength; i += 1)
	{
		var currGroup = this.groupsArray[i];
		currGroup.addNodesToWorld();
		currGroup.addJointsToWorld();
		this.worldNodes = this.worldNodes.concat(currGroup.nodes);
	}

	var toConstrainLength = this.toConstrain.length;
	for (i = 0; i < toConstrainLength; i += 1)
	{
		var currToConstrain = this.toConstrain[i];
		this.addConstraintToWorld(currToConstrain);
	}
};

module.exports = SVJellyWorld;

