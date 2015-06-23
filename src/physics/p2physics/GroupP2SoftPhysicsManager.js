// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/*jshint camelcase:false*/

var p2 = require('../../../libs/p2');
var NodeP2SoftPhysicsManager = require('./NodeP2SoftPhysicsManager');
var AnchorP2SoftPhysicsManager = require('./AnchorP2SoftPhysicsManager');
var JointP2PhysicsManager = require('./JointP2PhysicsManager');

var GroupP2SoftPhysicsManager = function ($group, $world, $worldHeight)
{
	this.group = $group;
	this.world = $world;
	this.worldHeight = $worldHeight;
	this.conf = $group.conf.physics;
	// this.constraints = [];
	//this.nodesDiameter = this.conf.nodesDiameter;
};

GroupP2SoftPhysicsManager.prototype.createAnchorFromPoint = function ($point)
{
	var anchor = new AnchorP2SoftPhysicsManager(this.group);
	anchor.setFromPoint($point);
	return anchor;
};

GroupP2SoftPhysicsManager.prototype.createAnchorFromLine = function ($linePoints)
{
	var closestPoint = this.group.getClosestPoint($linePoints);
	var anchor = new AnchorP2SoftPhysicsManager(this.group);
	anchor.setFromPoint(closestPoint);
	return anchor;
};

GroupP2SoftPhysicsManager.prototype.createAnchors = function ($points)
{
	var toReturn = [];
	var nodes = this.group.getNodesInside($points);
	for (var i = 0, length = nodes.length; i < length; i += 1)
	{
		var node = nodes[i];
		var currAnchorA = new AnchorP2SoftPhysicsManager(this.group);
		currAnchorA.setFromPoint([node.oX, node.oY]);
		toReturn.push(currAnchorA);
	}
	return toReturn;
};

GroupP2SoftPhysicsManager.prototype.addJointsToWorld = function ()
{
	for (var i = 0, length = this.group.joints.length; i < length; i += 1)
	{
		var joint = this.group.joints[i];
		joint.physicsManager = new JointP2PhysicsManager(joint, this.world, this.conf);
	}
};

GroupP2SoftPhysicsManager.prototype.setNodesMassFromJoints = function ()
{
	var NodeGraph = require('../../core/NodeGraph');
	var nodeGraph = new NodeGraph();
	var i;
	var startingVertices = [];
	var nodesLength = this.group.nodes.length;
	var jointsLength = this.group.joints.length;
	for (i = 0; i < jointsLength; i += 1)
	{
		var currJoint = this.group.joints[i];
		nodeGraph.connect(currJoint.nodeA, currJoint.nodeB);
	}
	for (i = 0; i < nodesLength; i += 1)
	{
		var node = this.group.nodes[i];
		if (node.fixed)
		{
			startingVertices.push(nodeGraph.getVertex(node));
		}
	}
	if (startingVertices.length === 0)
	{
		return;
	}
	nodeGraph.traverse(startingVertices);
	var verticesLength = nodeGraph.vertices.length;
	for (i = 0; i < verticesLength; i += 1)
	{
		var vertex = nodeGraph.vertices[i];
		var decay = Number(this.group.conf.physics.structuralMassDecay);
		var value = Math.pow(decay, vertex.mapValue / 5);//Math.pow(2, vertex.mapValue / 7.33);
		var body = vertex.node.physicsManager.body;
		if (!vertex.node.fixed)
		{
			//body.mass = this.conf.mass / this.group.nodes.length / value * body.getArea();
			//vertex.node.debugText = body.mass;
			//body.updateMassProperties();
			var massVariance = this.conf.massVariance || 0;
			var random = -massVariance + Math.random() * massVariance * 2;
			var baseMass = this.group.structure.area * this.conf.mass;
			var mass = baseMass + baseMass * random;
			body.mass = mass / value;
			body.invMass = 1 / body.mass;
			body.inertia = body.mass / 2;
			body.invInertia = 1 / body.inertia;
		}
	}
};

GroupP2SoftPhysicsManager.prototype.applyAngularForce = function ($value)
{
	//this.group.nodes[0].physicsManager.body.angularForce += $value;
	for (var i = 0, length = this.group.nodes.length; i < length; i += 1)
	{
		var currPhys = this.group.nodes[i].physicsManager;
		currPhys.body.angularForce += $value;
	}
};

GroupP2SoftPhysicsManager.prototype.applyForce = function ($vector)
{
	for (var i = 0, length = this.group.nodes.length; i < length; i += 1)
	{
		var currPhys = this.group.nodes[i].physicsManager;
		currPhys.body.force = [
			currPhys.body.force[0] + $vector[0],
			currPhys.body.force[1] + $vector[1]
		];
	}
};

GroupP2SoftPhysicsManager.prototype.getAngle = function ()
{
	return this.group.nodes[0].physicsManager.body.interpolatedAngle;
};


GroupP2SoftPhysicsManager.prototype.addNodesToWorld = function ()
{
	for (var i = 0, length = this.group.nodes.length; i < length; i += 1)
	{
		// this.baseBody = new p2.Body({
		// 	mass: 1
		// });
		var node = this.group.nodes[i];
		//var fractionMass = this.conf.mass / this.group.nodes.length;
		var area = this.group.structure.area;
		var nodeMass = area * this.conf.mass / this.group.nodes.length;
		//var mass = 500;
		//var mass = this.conf.mass;//Math.random() * 10 + 1;
		var body = new p2.Body({
			mass: node.fixed ? 0 : nodeMass,
			position: [node.oX, this.worldHeight - node.oY]
		});
		body.interpolatedPosition[0] = body.position[0];
		body.interpolatedPosition[1] = body.position[1];

		//if (node.fixed) { body.type = p2.Body.STATIC; }
		//console.log(node.oX, node.oY);
		//this.body.fixedRotation = true;

		// var radius = this.conf.nodeRadius;
		// var circleShape = new p2.Circle(radius);
		// body.addShape(circleShape);

		var radius = this.group.structure.innerRadius || this.group.conf.nodeRadius || 0.1;
		var circledShape = new p2.Circle(radius);
		body.addShape(circledShape);

		//console.log(this.body.getArea());

		//this.body.setDensity(node.type === 'line' ? 1 : 5000);


		//body.damping = 1;
		//body.mass = mass;
		node.physicsManager = new NodeP2SoftPhysicsManager(p2, body, this.worldHeight);
		node.physicsManager.radius = radius;
		//node.physicsManager.setFixed(node.fixed);
		//body.setDensity(0.1);
		this.world.addBody(body);

		//body.mass = body.getArea() * this.conf.mass;
		//body.gravityScale = 0.1;
		//body.updateMassProperties();
		// body.mass = 0;
		// body.setDensity(0);
		//node.physicsManager.applyForce([0, 0]);
		// body.mass = 10;
		var massVariance = this.conf.massVariance || 0;
		var random = -massVariance + Math.random() * massVariance * 2;
		body.mass = body.mass + body.mass * random;
		//body.mass = body.mass;
		body.invMass = 1 / body.mass;
		body.inertia = body.mass * 0.5;
		body.invInertia = 1 / body.inertia;
		body.collisionResponse = !this.conf.noCollide;

		body.angularDamping = this.conf.angularDamping || body.angularDamping;
		body.damping = this.conf.damping || body.damping;

		body.gravityScale = this.conf.gravityScale !== undefined ? this.conf.gravityScale : 1;
	}

	var Polygon = require('../../core/Polygon');
	var points = [];
	var envelope = this.group.drawing.nodes;
	var envelopeLength = this.group.drawing.nodes.length;
	for (i = 0; i < envelopeLength; i += 1)
	{
		points.push(envelope[i].physicsManager.body.interpolatedPosition);
	}
	this.polygon = Polygon.init(points);
	console.log(this.polygon);
	//debugger;

	if (this.conf.structuralMassDecay) { this.setNodesMassFromJoints(); }
};

GroupP2SoftPhysicsManager.prototype.hitTest = function ($point, $precision)
{
	var dx;
	var dy;
	var nodesLength = this.group.nodes.length;

	for (var m = 0; m < nodesLength; m += 1)
	{
		var body = this.group.nodes[m].physicsManager.body;
		dx = Math.abs(body.interpolatedPosition[0] - $point[0]);
		dy = Math.abs(body.interpolatedPosition[1] - $point[1]);
		if (dx < $precision && dy < $precision)
		{
			return body;
		}
	}
	if (this.polygon.isInside($point))
	{
		var closest;
		var closestHyp;
		for (var i = 0, length = this.polygon.points.length; i < length; i += 1)
		{
			var currPoint = this.polygon.points[i];
			dx = Math.abs($point[0] - currPoint[0]);
			dy = Math.abs($point[1] - currPoint[1]);
			var hyp = Math.sqrt(dx * dx + dy * dy);
			if (closestHyp === undefined || hyp < closestHyp)
			{
				closest = currPoint;
				closestHyp = hyp;
			}
		}
		for (var k = 0; k < nodesLength; k += 1)
		{
			var currNode = this.group.nodes[k];
			if (currNode.physicsManager.body.interpolatedPosition[0] === closest[0] &&
				currNode.physicsManager.body.interpolatedPosition[1] === closest[1])
			{
				return currNode.physicsManager.body;
			}
		}
		return closest;
	}
};

module.exports = GroupP2SoftPhysicsManager;

