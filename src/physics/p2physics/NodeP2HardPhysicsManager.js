// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/*jshint camelcase:false*/

var NodeP2HardPhysicsManager = function ($body, $position, $worldHeight)
{
	this.body = $body;
	this.position = $position;
	this.worldHeight = $worldHeight;
	this.offset = undefined;
};

NodeP2HardPhysicsManager.prototype.setOffset = function ($offset)
{
	var dX = this.position[0] + $offset[0];
	var dY = this.position[1] - $offset[1];
	this.angle = Math.atan2(dY, dX);
	this.hyp = Math.sqrt(dX * dX + dY * dY);
};

NodeP2HardPhysicsManager.prototype.getX = function ()
{
	//console.log(this.body.GetWorldCenter().get_x());
	return this.body.position[0] + this.hyp * Math.cos(this.body.angle + this.angle);
	// return this.body.position[0] + this.position[0] - this.offset[0];
};

NodeP2HardPhysicsManager.prototype.getY = function ()
{
	return this.worldHeight - (this.body.position[1] + this.hyp * Math.sin(this.body.angle + this.angle));
	// return this.worldHeight - (this.body.position[1] + this.position[1]) - this.offset[1];
};

module.exports = NodeP2HardPhysicsManager;

