var Commands = require('./Commands');

var DecorationDrawingCommand = function ($instructions, $physicsManager)
{
	this.physicsManager = $physicsManager;
	this.name = $instructions.name;
	this.point = $instructions.point;
	this.options = $instructions.options;
	var self = this;
	this.physicsManager.addedToWorld.then(function ()
	{
		self.relativePoint =
		[
			self.point[0] - $physicsManager.getX(),
			self.point[1] - $physicsManager.getY()
		];
		if (self.name === Commands.BEZIER_TO || self.name === Commands.QUADRA_TO)
		{
			self.cp1 =
			[
				self.relativePoint[0] + self.options[0][0],
				self.relativePoint[1] + self.options[0][1]
			];
		}
		if (self.name === Commands.BEZIER_TO)
		{
			self.cp2 =
			[
				self.relativePoint[0] + self.options[1][0],
				self.relativePoint[1] + self.options[1][1]
			];
		}
	});
};

DecorationDrawingCommand.prototype.setScale = function ($scaleX, $scaleY)
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

DecorationDrawingCommand.prototype.getRotation = function ()
{
	var rota = (this.physicsManager.getAngle());
	return this.options[2] - rota;//this.physicsManager.getAngle() * 180 / Math.PI;
};

DecorationDrawingCommand.prototype.getControlPoint = function ($cp)
{
	var angle = -this.physicsManager.getAngle();
	var x = $cp[0];
	var y = $cp[1];
	return [
		(this.physicsManager.getX() + x * Math.cos(angle) - y * Math.sin(angle)) * this.scaleX,
		(this.physicsManager.getY() + y * Math.cos(angle) + x * Math.sin(angle)) * this.scaleY
	];
};

DecorationDrawingCommand.prototype.getCP1 = function ()
{
	return this.getControlPoint(this.cp1);
};

DecorationDrawingCommand.prototype.getCP2 = function ()
{
	return this.getControlPoint(this.cp2);
};

DecorationDrawingCommand.prototype.getX = function ()
{
	var angle = -this.physicsManager.getAngle();
	var x = this.relativePoint[0];
	var y = this.relativePoint[1];
	return (this.physicsManager.getX() + x * Math.cos(angle) - y * Math.sin(angle)) * this.scaleX;
};

DecorationDrawingCommand.prototype.getY = function ()
{
	var angle = -this.physicsManager.getAngle();
	var x = this.relativePoint[0];
	var y = this.relativePoint[1];
	return (this.physicsManager.getY() + y * Math.cos(angle) + x * Math.sin(angle)) * this.scaleY;
};

module.exports = DecorationDrawingCommand;
