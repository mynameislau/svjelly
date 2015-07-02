var NodeDrawingCommand = require('./NodeDrawingCommand');
var Commands = require('./Commands');

var ObjectDrawing = function ($group)
{
	this.group = $group;
	this.commands = [];
	this.commandsLength = 0;
	this.properties = undefined;
};

ObjectDrawing.prototype.setProperties = function ($properties)
{
	this.properties = $properties;
	this.useDynamicGradient = this.group.conf.structure === 'line' && this.properties.strokeGradient;
};

ObjectDrawing.prototype.setCommands = function ()
{
	for (var i = 0, length = this.group.structure.nodeProperties.length; i < length; i += 1)
	{
		var curr = this.group.structure.nodeProperties[i];
		this.addCommand(curr.node, curr.commandProperties, curr.isEnvelope);
	}
};

ObjectDrawing.prototype.addCommand = function ($node, $commandProperties, $envelope)
{
	var commandName;
	var properties = $commandProperties;
	if ($envelope === false && !this.group.conf.drawNodesSeparately)
	{
		return;
	}
	if (properties) { commandName = properties.name; }
	else
	{
		if (this.group.conf.drawNodesSeparately)
		{
			commandName = Commands.ARC;
			properties = {};
			properties.options = [];
			properties.options[0] = this.group.conf.nodeRadius;
		}
		else
		{
			commandName = this.commandsLength === 0 ? Commands.MOVE_TO : Commands.LINE_TO;
		}
	}
	// commandName = Commands.ARC;
	// $properties.options[0] = 5;
	// $properties.options[1] = 5;
	var command = new NodeDrawingCommand(commandName, $node, properties);
	this.commands.push(command);
	this.commands[0].endCommand = command;
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
