// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/*jshint camelcase:false*/

var NodeP2SoftPhysicsManager = function ($body, $worldHeight)
{
	this.body = $body;
	this.worldHeight = $worldHeight;
};

NodeP2SoftPhysicsManager.prototype.applyForce = function ($vec)
{
	//console.log('nop', this.body.applyForceLocal, $vec);
	var loc = [];
	this.body.toWorldFrame(loc, [0, 0]);
	this.body.applyForce($vec, loc);
};

NodeP2SoftPhysicsManager.prototype.getX = function ()
{
	//console.log(this.body.GetWorldCenter().get_x());
	return this.body.position[0];
};

NodeP2SoftPhysicsManager.prototype.getY = function ()
{
	return this.worldHeight - this.body.position[1];
};

module.exports = NodeP2SoftPhysicsManager;

