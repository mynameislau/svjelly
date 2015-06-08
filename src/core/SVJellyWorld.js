var SVJellyGroup = require('./SVJellyGroup');
var Structure = require('./Structure');

var SVJellyWorld = function ($physicsManager, $conf)
{
	this.physicsManager = $physicsManager;
	this.groupsArray = [];
	this.conf = $conf;
	this.worldNodes = [];
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

SVJellyWorld.prototype.createGroup = function ($type)
{
	var type = $type || 'default';
	var group = new SVJellyGroup(type, this.conf.groups[type]);
	group.physicsManager = this.physicsManager.getGroupPhysicsManager(group);
	group.structure = new Structure(group, this);
	this.groupsArray.push(group);
	return group;
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
};

module.exports = SVJellyWorld;

