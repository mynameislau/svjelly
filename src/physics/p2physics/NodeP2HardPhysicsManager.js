// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/*jshint camelcase:false*/
var p2 = require('../../../libs/p2');

var NodeP2HardPhysicsManager = function ($body, $position, $worldHeight)
{
	this.body = $body;
	this.position = $position;
	this.worldHeight = $worldHeight;
	this.offset = [0, 0];
	this.getX = this.getXSimple;
	this.getY = this.getYSimple;
};

NodeP2HardPhysicsManager.prototype.setFixed = function ($fixed)
{
	if ($fixed)
	{
		this.body.type = p2.Body.STATIC;
		this.body.updateMassProperties();
	}
};

NodeP2HardPhysicsManager.prototype.setOffset = function ($offset)
{
	var dX = this.position[0] + $offset[0];
	var dY = this.position[1] - $offset[1];
	this.angle = Math.atan2(dY, dX);
	this.hyp = Math.sqrt(dX * dX + dY * dY);
	this.getX = this.getXOffset;
	this.getY = this.getYOffset;
};

NodeP2HardPhysicsManager.prototype.getXSimple = function ()
{
	return this.body.interpolatedPosition[0];
};

NodeP2HardPhysicsManager.prototype.getYSimple = function ()
{
	return this.worldHeight - this.body.interpolatedPosition[1];
};

NodeP2HardPhysicsManager.prototype.getXOffset = function ()
{
	return this.body.interpolatedPosition[0] + this.hyp * Math.cos(this.body.interpolatedAngle + this.angle);
};

NodeP2HardPhysicsManager.prototype.getYOffset = function ()
{
	return this.worldHeight - (this.body.interpolatedPosition[1] + this.hyp * Math.sin(this.body.interpolatedAngle + this.angle));
};

module.exports = NodeP2HardPhysicsManager;

