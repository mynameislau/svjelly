var Commands = require('./Commands');

var NodeDrawingCommand = function ($name, $node, $instructions)
{
	this.node = $node;
	this.name = $name;
	if ($instructions)
	{
		this.point = $instructions.point;
		this.options = $instructions.options;
	}
	this.properties = {};
};

NodeDrawingCommand.prototype.setScale = function ($scaleX, $scaleY)
{
	this.scaleX = $scaleX;
	this.scaleY = $scaleY;

	if (this.name === Commands.CIRCLE || this.name === Commands.ELLIPSE)
	{
		this.radius = this.options[0] * this.scaleX;
	}
	if (this.name === Commands.ELLIPSE)
	{
		this.radiusB = this.options[1] * this.scaleX;
	}
};

NodeDrawingCommand.prototype.getControlPoint = function ($cp)
{
	return [
		(this.node.physicsManager.getX() + $cp[0]) * this.scaleX,
		(this.node.physicsManager.getY() + $cp[1]) * this.scaleY
	];
};

NodeDrawingCommand.prototype.getCP1 = function ()
{
	return this.getControlPoint(this.options[0]);
};

NodeDrawingCommand.prototype.getCP2 = function ()
{
	return this.getControlPoint(this.options[1]);
};

NodeDrawingCommand.prototype.getRotation = function ()
{
	return this.options[2] - this.node.physicsManager.getAngle();
};

NodeDrawingCommand.prototype.getX = function ()
{
	return this.node.physicsManager.getX() * this.scaleX;
};

NodeDrawingCommand.prototype.getY = function ()
{
	return this.node.physicsManager.getY() * this.scaleY;
};

module.exports = NodeDrawingCommand;
