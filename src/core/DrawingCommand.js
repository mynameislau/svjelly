var DrawingCommand = function ($name, $node, $instructions)
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

DrawingCommand.prototype.getX = function ()
{
	return this.node.physicsManager.getX();
};

DrawingCommand.prototype.getY = function ()
{
	return this.node.physicsManager.getY();
};

module.exports = DrawingCommand;
