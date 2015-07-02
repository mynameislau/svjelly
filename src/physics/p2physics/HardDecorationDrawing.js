var HardDecorationDrawingCommand = require('./HardDecorationDrawingCommand');

var HardDecorationDrawing = function ($group)
{
	this.group = $group;
	this.commands = [];

	this.properties = undefined;
};

HardDecorationDrawing.prototype.setDrawingCommands = function ($drawingCommands)
{
	for (var i = 0, length = $drawingCommands.pointCommands.length; i < length; i += 1)
	{
		var curr = $drawingCommands.pointCommands[i];
		this.commands.push(new HardDecorationDrawingCommand(curr, this.group));
	}
	this.commandsLength = this.commands.length;
};

HardDecorationDrawing.prototype.setProperties = function ($properties)
{
	this.properties = $properties;
	this.useDynamicGradient = false;
};

HardDecorationDrawing.prototype.getBoundingBox = function ()
{
	return this.group.physicsManager.getBoundingBox();
};

HardDecorationDrawing.prototype.isStatic = function ()
{
	return this.group.conf.fixed === true;
};

HardDecorationDrawing.prototype.willNotIntersect = function ()
{
	return false;
};

HardDecorationDrawing.prototype.isSimpleDrawing = function ()
{
	return false;
};

module.exports = HardDecorationDrawing;
