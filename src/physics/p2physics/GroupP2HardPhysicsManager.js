// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/*jshint camelcase:false*/

var p2 = require('../../../libs/p2');
var NodeP2HardPhysicsManager = require('./NodeP2HardPhysicsManager');
var AnchorP2HardPhysicsManager = require('./AnchorP2HardPhysicsManager');

var GroupP2HardPhysicsManager = function ($group, $P2World, $worldHeight, $materialsList)
{
	this.group = $group;
	this.materialsList = $materialsList;
	this.worldHeight = $worldHeight;
	this.P2World = $P2World;
	this.conf = $group.conf.physics;
};

GroupP2HardPhysicsManager.prototype.createAnchorFromPoint = function ($point)
{
	var anchor = new AnchorP2HardPhysicsManager(this.group);
	anchor.setFromPoint($point);
	return anchor;
};

GroupP2HardPhysicsManager.prototype.createAnchorFromLine = function ($linePoints)
{
	var closestPoint = this.group.getClosestPoint($linePoints);
	var anchor = new AnchorP2HardPhysicsManager(this.group);
	anchor.setFromPoint(closestPoint);
	return anchor;
};

GroupP2HardPhysicsManager.prototype.createAnchors = function ($points)
{
	var toReturn = [];
	var nodes = this.group.getNodesInside($points);
	if (!nodes.length)
	{
		var defaultAnchor = new AnchorP2HardPhysicsManager(this.group);
		var closest = this.group.getClosestPoint($points);
		defaultAnchor.setFromPoint(closest);
		return [defaultAnchor];
	}
	for (var i = 0, length = nodes.length; i < length; i += 1)
	{
		var node = nodes[i];
		var currAnchorA = new AnchorP2HardPhysicsManager(this.group);
		currAnchorA.setFromPoint([node.oX, node.oY]);
		toReturn.push(currAnchorA);
	}
	return toReturn;
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
		mass: this.group.fixed ? 0 : 1,
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
		var radius = this.group.structure.radiusX;
		var circleShape = new p2.Circle(radius);
		this.body.addShape(circleShape);
	}

	this.body.gravityScale = this.conf.gravityScale !== undefined ? this.conf.gravityScale : 1;
	// console.log(startX, this.worldHeight - startY, this.body.position[0], this.body.position[1]);
	//this.body.mass = this.conf.mass;
	//if (this.group.conf.fixed) { node.physicsManager.setFixed(this.group.conf.fixed); }
	//this.body.updateMassProperties();
	var shapesLength = this.body.shapes.length;
	for (i = 0; i < shapesLength; i += 1)
	{
		var currShape = this.body.shapes[i];
		currShape.material = this.conf.material ? this.materialsList[this.conf.material].material : this.materialsList.default.material;
		console.log(currShape.material);
	}
	this.P2World.addBody(this.body);
	this.body.mass = this.body.getArea() * this.conf.mass;
	this.body.updateMassProperties();
	this.body.collisionResponse = !this.conf.noCollide;

	if (this.group.ID === 'ground')
	{
		console.log(this.body);
	}

	this.body.interpolatedPosition[0] = this.body.position[0];
	this.body.interpolatedPosition[1] = this.body.position[1];
	//node.physicsManager.setFixed(this.group.conf.fixed);
	// console.log(this.body.shapes);
	// debugger;
};

GroupP2HardPhysicsManager.prototype.hitTest = function ($point)
{
	var result = this.P2World.hitTest($point, [this.body]);
	return result ? result[0] : undefined;
};

module.exports = GroupP2HardPhysicsManager;

