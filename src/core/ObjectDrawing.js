var ObjectDrawing = function ($group)
{
	this.group = $group;
	this.commands = [];
	this.commandsLength = 0;
	this.properties = {};
};

ObjectDrawing.prototype.addCommand = function ($command)
{
	this.commands.push($command);
	this.commands[0].endCommand = $command;
	this.commandsLength += 1;
};

ObjectDrawing.prototype.getBoundingBox = function ()
{
	return this.group.physicsManager.getBoundingBox();
};

ObjectDrawing.prototype.isStatic = function ()
{
	return this.group.conf.fixed === true;
};

ObjectDrawing.prototype.getCollisionGroup = function ()
{
	return this.group.conf.physics.bodyType;
};

ObjectDrawing.prototype.willNotIntersect = function ()
{
	if (this.group.conf.physics.bodyType === 'hard')
	{
		return true;
	}
	return false;
};

ObjectDrawing.prototype.isSimpleDrawing = function ()
{
	if (this.group.conf.physics.bodyType === 'hard' || this.group.conf.physics.bodyType === 'soft')
	{
		return true;
	}
	return false;
};

module.exports = ObjectDrawing;
