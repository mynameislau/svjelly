var DecorationDrawingCommand = require('../../core/DecorationDrawingCommand');
var DecorationDrawing = require('../../core/DecorationDrawing');

var HardDecorationDrawing = Object.create(DecorationDrawing);
HardDecorationDrawing.create = function ($group)
{
	var inst = Object.create(HardDecorationDrawing);
	inst.group = $group;
	inst.commands = [];

	inst.properties = undefined;

	return inst;
};

HardDecorationDrawing.setDrawingCommands = function ($drawingCommands)
{
	for (var i = 0, length = $drawingCommands.pointCommands.length; i < length; i += 1)
	{
		var curr = $drawingCommands.pointCommands[i];
		this.commands.push(new DecorationDrawingCommand(curr, this.group.physicsManager));
	}
	this.commandsLength = this.commands.length;
};

HardDecorationDrawing.setProperties = function ($properties)
{
	this.properties = $properties;
	this.useDynamicGradient = false;
};

HardDecorationDrawing.getBoundingBox = function ()
{
	return this.group.physicsManager.getBoundingBox();
};

HardDecorationDrawing.isStatic = function ()
{
	return this.group.conf.fixed === true;
};

HardDecorationDrawing.willNotIntersect = function ()
{
	return false;
};

HardDecorationDrawing.isSimpleDrawing = function ()
{
	return false;
};

module.exports = HardDecorationDrawing;
