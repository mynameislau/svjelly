// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/*jshint camelcase:false*/

var p2 = require('../../../libs/p2');
var P2Utils = require('./P2Utils');
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
	this.newTime = undefined;
	this.lastTime = undefined;
	this.materialsList = [];

	//this.p2World.gravity = this.conf.gravity;

	this.setMaterials();
};

P2PhysicsManager.prototype.step = function ($time)
{
	this.newTime = $time - this.lastTime || 0;
	this.lastTime = $time;
	this.p2World.step(1 / 60, this.newTime, 5);
};

P2PhysicsManager.prototype.constrainGroups = function ($anchorA, $anchorB, $type)
{
	$anchorA.addToWorld();
	$anchorB.addToWorld();

	var constraintConfig = this.conf.constraints[$type];

	P2Utils.createConstraints(this.p2World, $anchorA.body, $anchorB.body, constraintConfig, [$anchorA.offset, $anchorB.offset]);
};

P2PhysicsManager.prototype.createGhostAnchorFromPoints = function ($points)
{
	var Polygon = require('../../core/Polygon');
	var polygon = Polygon.init($points);
	var center = polygon.getCenter();
	return this.createGhostAnchorFromPoint(center);
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
		case 'hard': return new GroupP2HardPhysicsManager($group, this.p2World, this.worldHeight, this.materialsList);
		case 'soft': return new GroupP2SoftPhysicsManager($group, this.p2World, this.worldHeight);
	}
};

P2PhysicsManager.prototype.setMaterials = function ()
{
	var materialName;
	for (materialName in this.conf.materials)
	{
		var materialConf = this.conf.materials[materialName];
		var currMaterial = new p2.Material();
		var curr = this.materialsList[materialName] = { material: currMaterial, materialConfig: materialConf };
		for (var otherName in this.materialsList)
		{
			var other = this.materialsList[otherName];
			var contactMaterial = new p2.ContactMaterial(curr.material, other.material, {
				friction: curr.materialConfig.friction + (other.materialConfig.friction - curr.materialConfig.friction) / 2,
				relaxation: curr.materialConfig.bounciness + (other.materialConfig.bounciness - curr.materialConfig.bounciness) / 2
			});
			console.log(contactMaterial);
			this.p2World.addContactMaterial(contactMaterial);
		}
	}
};

module.exports = P2PhysicsManager;

