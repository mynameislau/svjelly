var DecorationDrawingCommand = require('../../core/DecorationDrawingCommand');
var DecorationDrawing = require('../../core/DecorationDrawing');

var SoftDecorationDrawing = Object.create(DecorationDrawing);
SoftDecorationDrawing.create = function ($group)
{
	var inst = Object.create(SoftDecorationDrawing);
	inst.group = $group;
	inst.commands = [];

	inst.properties = undefined;

	return inst;
};

SoftDecorationDrawing.setDrawingCommands = function ($drawingCommands)
{
	for (var i = 0, length = $drawingCommands.pointCommands.length; i < length; i += 1)
	{
		var curr = $drawingCommands.pointCommands[i];
		var closestNode = this.group.getClosestNode(curr.point);
		console.log(closestNode.ID);
		this.commands.push(new DecorationDrawingCommand(curr, closestNode.physicsManager));
	}
	this.commandsLength = this.commands.length;
};

SoftDecorationDrawing.setProperties = function ($properties)
{
	this.properties = $properties;
	this.useDynamicGradient = false;
};

SoftDecorationDrawing.getBoundingBox = function ()
{
	return this.group.physicsManager.getBoundingBox();
};

SoftDecorationDrawing.isStatic = function ()
{
	return this.group.conf.fixed === true;
};

SoftDecorationDrawing.willNotIntersect = function ()
{
	return false;
};

SoftDecorationDrawing.isSimpleDrawing = function ()
{
	return false;
};

module.exports = SoftDecorationDrawing;
