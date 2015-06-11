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

GroupP2HardPhysicsManager.Anchor = function ($group) { this.group = $group; };
// GroupP2HardPhysicsManager.Anchor.prototype.setup = function ($body, $point, $offset)
// {
// 	this.body = $body;
// 	this.point = $point;
// 	this.offset = [0, 0];
// };
GroupP2HardPhysicsManager.Anchor.prototype.getX = function () { return this.body.position[0]; };
GroupP2HardPhysicsManager.Anchor.prototype.getY = function () { return this.body.position[1]; };
GroupP2HardPhysicsManager.Anchor.prototype.setup = function ($points)
{
	var closestDist = Infinity;
	var closestPoint;
	var closestNode;
	var closestOffsetX;
	var closestOffsetY;

	for (var i = 0, length = $points.length; i < length; i += 1)
	{
		var currPoint = $points[i];
		for (var k = 0, nodesLength = this.group.nodes.length; k < nodesLength; k += 1)
		{
			var currNode = this.group.nodes[k];
			var offsetX = currPoint[0] - currNode.oX;
			var offsetY = currPoint[1] - currNode.oY;
			var cX = Math.abs(offsetX);
			var cY = Math.abs(offsetY);
			var dist = Math.sqrt(cX * cX + cY * cY);
			if (dist < closestDist)
			{
				closestNode = currNode;
				closestPoint = currPoint;
				closestDist = dist;
				closestOffsetX = offsetX;
				closestOffsetY = offsetY;
			}
		}
	}
	this.body = this.group.physicsManager.body;
	this.point = closestPoint;
	this.offset = [0, 0];
	//$anchor.setup(this.body, closestPoint);

	//return { node: closestNode, point: closestPoint, offset: [this.body.position[0] - closestPoint[0], this.body.position[1] - closestPoint[1]] };
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
		mass: this.group.conf.fixed ? 0 : 1,
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

	if (length > 1)
	{
		this.body.fromPolygon(path);
		var offset = [initX - this.body.position[0], this.body.position[1] - initY];
		i = 0;
		for (i; i < length; i += 1)
		{
			node = this.group.nodes[i];
			node.physicsManager.setOffset(offset);
		}
	}
	else
	{
		var radius = this.group.structureInfos.radius;
		var circleShape = new p2.Circle(radius);
		this.body.addShape(circleShape);
	}

	this.body.gravityScale = this.conf.gravityScale || 1;
	// console.log(startX, this.worldHeight - startY, this.body.position[0], this.body.position[1]);
	//this.body.mass = this.conf.mass;
	//if (this.group.conf.fixed) { node.physicsManager.setFixed(this.group.conf.fixed); }
	//this.body.updateMassProperties();
	this.P2World.addBody(this.body);
	this.body.mass = this.body.getArea() * this.conf.mass;
	this.body.updateMassProperties();
	//node.physicsManager.setFixed(this.group.conf.fixed);
	// console.log(this.body.shapes);
	// debugger;
};

module.exports = GroupP2HardPhysicsManager;

