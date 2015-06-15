// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/*jshint camelcase:false*/

var p2 = require('../../../libs/p2');
var GroupP2SoftPhysicsManager = require('./GroupP2SoftPhysicsManager');
var GroupP2HardPhysicsManager = require('./GroupP2HardPhysicsManager');
var GroupGhostPhysicsManager = require('./GroupGhostPhysicsManager');
var AnchorP2GhostPhysicsManager = require('./AnchorP2GhostPhysicsManager');

var P2PhysicsManager = function ($conf)
{
	this.p2World = new p2.World($conf);
	this.p2 = p2;
	this.conf = $conf;
	this.worldWidth = undefined;
	this.worldHeight = undefined;
	//this.p2World.gravity = this.conf.gravity;
};

P2PhysicsManager.prototype.step = function ($time)
{
	this.p2World.step($time);
};

P2PhysicsManager.prototype.constrainGroups = function ($anchorA, $anchorB)
{
	$anchorA.addToWorld();
	$anchorB.addToWorld();
	var constraint = new p2.DistanceConstraint($anchorA.body, $anchorB.body,
	{
		localAnchorA: $anchorA.offset, // Point on bodyA
		localAnchorB: $anchorB.offset // Point on bodyB
	});
	this.p2World.addConstraint(constraint);
};

P2PhysicsManager.prototype.createGhostAnchorFromPoint = function ($point)
{
	var anchor = new AnchorP2GhostPhysicsManager(this.p2, this.p2World, this.worldHeight);
	anchor.setFromPoint($point);
	return anchor;
};

P2PhysicsManager.prototype.getGroupPhysicsManager = function ($group)
{
	switch ($group.conf.physics.bodyType)
	{
		case 'ghost': return new GroupGhostPhysicsManager($group);
		case 'hard': return new GroupP2HardPhysicsManager(this.p2World, this.worldHeight, $group, $group.conf.physics);
		default: return new GroupP2SoftPhysicsManager(this.p2World, this.worldHeight, $group, $group.conf.physics);
	}
};

module.exports = P2PhysicsManager;

