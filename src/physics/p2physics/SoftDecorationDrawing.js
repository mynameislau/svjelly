var SoftDecorationDrawingCommand = require('./SoftDecorationDrawingCommand');

var SoftDecorationDrawing = function ($group)
{
	this.group = $group;
	this.commands = [];

	this.properties = undefined;
};

SoftDecorationDrawing.prototype.setDrawingCommands = function ($drawingCommands)
{
	for (var i = 0, length = $drawingCommands.pointCommands.length; i < length; i += 1)
	{
		var curr = $drawingCommands.pointCommands[i];
		this.commands.push(new SoftDecorationDrawingCommand(curr, this.group));
	}
	this.commandsLength = this.commands.length;
};

SoftDecorationDrawing.prototype.setProperties = function ($properties)
{
	this.properties = $properties;
	this.useDynamicGradient = false;
};

SoftDecorationDrawing.prototype.getBoundingBox = function ()
{
	return this.group.physicsManager.getBoundingBox();
};

SoftDecorationDrawing.prototype.isStatic = function ()
{
	return this.group.conf.fixed === true;
};

SoftDecorationDrawing.prototype.willNotIntersect = function ()
{
	return false;
};

SoftDecorationDrawing.prototype.isSimpleDrawing = function ()
{
	return false;
};

module.exports = SoftDecorationDrawing;
