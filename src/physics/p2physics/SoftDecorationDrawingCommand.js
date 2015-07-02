var SoftDecorationDrawingCommand = function ($instructions, $group)
{
	this.physicsManager = $group.physicsManager;
	this.name = $instructions.name;
	this.point = $instructions.point;
	this.options = $instructions.options;
	var self = this;
	this.physicsManager.nodesAddedPromise.then(function ()
	{
		self.node = $group.getClosestNode(self.point);
		console.log(self.node.physicsManager.getX(), self.node.physicsManager.getY());
		self.relativePoint =
		[
			self.point[0] - self.node.physicsManager.getX(),
			self.point[1] - self.node.physicsManager.getY()
		];
	});
};

SoftDecorationDrawingCommand.prototype.getX = function ()
{
	return this.node.physicsManager.getX() + this.relativePoint[0];
};

SoftDecorationDrawingCommand.prototype.getY = function ()
{
	return this.node.physicsManager.getY() + this.relativePoint[1];
};

module.exports = SoftDecorationDrawingCommand;
