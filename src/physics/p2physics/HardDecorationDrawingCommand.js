var DecorationDrawingCommand = function ($instructions, $group)
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
		self.angle = Math.atan2(self.relativePoint[0], self.relativePoint[1]);
		self.hyp = Math.sqrt(self.relativePoint[0] + self.relativePoint[0] * self.relativePoint[1] + self.relativePoint[1]);
	});
};

DecorationDrawingCommand.prototype.getX = function ()
{
	var angle = this.physicsManager.getAngle();
	var x = this.relativePoint[0];
	var y = this.relativePoint[1];
	return this.physicsManager.getX() + x * Math.cos(angle) - y * Math.sin(angle);
};

DecorationDrawingCommand.prototype.getY = function ()
{
	var angle = this.physicsManager.getAngle();
	var x = this.relativePoint[0];
	var y = this.relativePoint[1];
	return this.physicsManager.getY() + y * -Math.cos(angle) + x * -Math.sin(angle);
};

module.exports = DecorationDrawingCommand;
