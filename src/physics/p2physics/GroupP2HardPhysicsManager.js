// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/*jshint camelcase:false*/

var p2 = require('../../../libs/p2');
var NodeP2HardPhysicsManager = require('./NodeP2HardPhysicsManager');

var GroupP2HardPhysicsManager = function ($P2World, $worldHeight, $group, $conf)
{
	this.group = $group;
	this.worldHeight = $worldHeight;
	this.P2World = $P2World;
	this.conf = $conf;
};

GroupP2HardPhysicsManager.prototype.addJointsToWorld = function () { return; };

GroupP2HardPhysicsManager.prototype.addNodesToWorld = function ()
{
	var path = [];
	var boundingBox = this.group.getBoundingBox();
	var width = boundingBox[1][0] - boundingBox[0][0];
	var height = boundingBox[1][1] - boundingBox[0][1];
	var startX = boundingBox[0][0] + width * 0.5;
	var startY = boundingBox[0][1] + height * 0.5;

	//startX = this.group.nodes[0].oX;
	//startY = this.group.nodes[0].oY;
	var initX = startX;
	var initY = this.worldHeight - startY;

	this.body = new p2.Body({
		mass: this.conf.mass,
		position: [startX, this.worldHeight - startY]
	});
	var node;
	for (var i = 0, length = this.group.nodes.length; i < length; i += 1)
	{
		node = this.group.nodes[i];
		var pos = [node.oX - startX, -(node.oY - startY)];
		node.physicsManager = new NodeP2HardPhysicsManager(this.body, pos, this.worldHeight);
		path.push(pos);
	}
	this.body.fromPolygon(path);
	var offset = [initX - this.body.position[0], this.body.position[1] - initY];
	i = 0;
	for (i; i < length; i += 1)
	{
		node = this.group.nodes[i];
		node.physicsManager.setOffset(offset);
	}
	// console.log(startX, this.worldHeight - startY, this.body.position[0], this.body.position[1]);
	this.P2World.addBody(this.body);
	// console.log(this.body.shapes);
	// debugger;
};

module.exports = GroupP2HardPhysicsManager;

