// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/*jshint camelcase:false*/

var p2 = require('../../../libs/p2');
var GroupP2SoftPhysicsManager = require('./GroupP2SoftPhysicsManager');
var GroupP2HardPhysicsManager = require('./GroupP2HardPhysicsManager');
var GroupGhostPhysicsManager = require('./GroupGhostPhysicsManager');

var P2PhysicsManager = function ($conf)
{
	this.P2World = new p2.World($conf);
	this.conf = $conf;
	this.worldWidth = undefined;
	this.worldHeight = undefined;
	this.P2World.gravity = this.conf.gravity;
};

P2PhysicsManager.prototype.step = function ($time)
{
	this.P2World.step($time);
};

P2PhysicsManager.prototype.getGroupPhysicsManager = function ($group)
{
	switch ($group.conf.physics.bodyType)
	{
		case 'ghost': return new GroupGhostPhysicsManager($group);
		case 'hard': return new GroupP2HardPhysicsManager(this.P2World, this.worldHeight, $group, $group.conf.physics);
		default: return new GroupP2SoftPhysicsManager(this.P2World, this.worldHeight, $group, $group.conf.physics);
	}
};

module.exports = P2PhysicsManager;

