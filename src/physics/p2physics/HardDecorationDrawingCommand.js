var HardDecorationDrawingCommand = function ($instructions, $group)
{
	this.physicsManager = $group.physicsManager;
	this.name = $instructions.name;
	this.point = $instructions.point;
	this.options = $instructions.options;
	var self = this;

	this.physicsManager.nodesAddedPromise.then(function ()
	{
		self.relativePoint =
		[
			(self.point[0] - self.physicsManager.getX()),
			(self.physicsManager.getY() - self.point[1])
		];
	});
};

HardDecorationDrawingCommand.prototype.getRotation = function ()
{
	return this.options[2] + this.node.physicsManager.getAngle() * (180 / Math.PI);
};

HardDecorationDrawingCommand.prototype.getX = function ()
{
	var angle = this.physicsManager.getAngle();
	var x = this.relativePoint[0];
	var y = this.relativePoint[1];
	return this.physicsManager.getX() + x * Math.cos(angle) - y * Math.sin(angle);
};

HardDecorationDrawingCommand.prototype.getY = function ()
{
	var angle = this.physicsManager.getAngle();
	var x = this.relativePoint[0];
	var y = this.relativePoint[1];
	return this.physicsManager.getY() + y * -Math.cos(angle) + x * -Math.sin(angle);
};

module.exports = HardDecorationDrawingCommand;
