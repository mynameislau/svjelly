var SVJellyGroup = require('./SVJellyGroup');
var Structure = require('./Structure');

var SVJellyWorld = function ($physicsManager, $conf)
{
	this.physicsManager = $physicsManager;
	this.groupsArray = [];
	this.conf = $conf;
	this.worldNodes = [];
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
	var conf = this.conf.groups[$type] || this.conf.groups.default;
	var group = new SVJellyGroup($type, conf, $ID);
	group.physicsManager = this.physicsManager.getGroupPhysicsManager(group);
	group.structure = new Structure(group, this);
	this.groupsArray.push(group);
	return group;
};

SVJellyWorld.prototype.constrainGroups = function ($groupA, $groupB, $points)
{
	var points = $points;
	var groupA = $groupA;
	var groupB = $groupB;

	if (points.length < 3)
	{
		var anchorA = groupA.physicsManager.createAnchorFromLine(points);
		points.splice(points.indexOf(anchorA.point), 1);
		var anchorB = groupB ? groupB.physicsManager.createAnchorFromPoint(points[0]) : this.physicsManager.createGhostAnchorFromPoint(points[0]);
		this.groupConstraints.push({ anchorA: anchorA, anchorB: anchorB });
	}
	else
	{
		var anchorsA = groupA.physicsManager.createAnchors(points);
		//console.log('A', groupA.ID, anchorsA.length, 'B', groupB ? groupB.ID : groupB);
		for (var i = 0, nodesLength = anchorsA.length; i < nodesLength; i += 1)
		{
			var currAnchorA = anchorsA[i];
			if (!groupB)
			{
				currAnchorA.setFixed(true);
			}
			else
			{
				var anchorsB = groupB.physicsManager.createAnchors(points);
				for (var k = 0, anchorsBLength = anchorsB.length; k < anchorsBLength; k += 1)
				{
					var currAnchorB = anchorsB[k];
					this.groupConstraints.push({ anchorA: currAnchorA, anchorB: currAnchorB });
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

	var toConstrainLength = this.groupConstraints.length;
	for (i = 0; i < toConstrainLength; i += 1)
	{
		var currToConstrain = this.groupConstraints[i];
		this.physicsManager.constrainGroups(currToConstrain.anchorA, currToConstrain.anchorB);
	}
};

module.exports = SVJellyWorld;

