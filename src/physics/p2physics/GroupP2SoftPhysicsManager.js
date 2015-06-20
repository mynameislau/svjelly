// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/*jshint camelcase:false*/

var p2 = require('../../../libs/p2');
var NodeP2SoftPhysicsManager = require('./NodeP2SoftPhysicsManager');
var AnchorP2SoftPhysicsManager = require('./AnchorP2SoftPhysicsManager');

var GroupP2SoftPhysicsManager = function ($world, $worldHeight, $group, $conf)
{
	this.group = $group;
	this.world = $world;
	this.worldHeight = $worldHeight;
	this.conf = $conf;
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
		var lock = this.conf.lockConstraint;
		var distance = this.conf.distanceConstraint;
		var linearSpring = this.conf.linearSpring;
		var rotationalSpring = this.conf.rotationalSpring;

		if (lock)
		{
			var constraint1 = new p2.LockConstraint(joint.node1.physicsManager.body, joint.node2.physicsManager.body);
			if (lock.stiffness) { constraint1.setStiffness(lock.stiffness); } //default 20
			if (lock.relaxation) { constraint1.setRelaxation(lock.relaxation); }
			this.world.addConstraint(constraint1);
		}
		if (distance)
		{
			var constraint2 = new p2.DistanceConstraint(joint.node1.physicsManager.body, joint.node2.physicsManager.body);
			if (distance.stiffness) { constraint2.setStiffness(distance.stiffness); } // default 500
			if (distance.relaxation) { constraint2.setRelaxation(distance.relaxation); }// default 0.1
			this.world.addConstraint(constraint2);
		}
		if (linearSpring)
		{
			var constraint3 = new p2.LinearSpring(joint.node1.physicsManager.body, joint.node2.physicsManager.body);
			if (linearSpring.stiffness) { constraint3.stiffness = linearSpring.stiffness; }
			if (linearSpring.damping) { constraint3.damping = linearSpring.damping; }
			this.world.addSpring(constraint3);
		}
		if (rotationalSpring)
		{
			var constraint4 = new p2.RotationalSpring(joint.node1.physicsManager.body, joint.node2.physicsManager.body);
			if (rotationalSpring.stiffness) { constraint4.stiffness = rotationalSpring.stiffness; }
			if (rotationalSpring.damping) { constraint4.damping = rotationalSpring.damping; }
			//this.world.addSpring(constraint4);
		}
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
		nodeGraph.connect(currJoint.node1, currJoint.node2);
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

GroupP2SoftPhysicsManager.prototype.addNodesToWorld = function ()
{
	for (var i = 0, length = this.group.nodes.length; i < length; i += 1)
	{
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
		body.gravityScale = this.conf.gravityScale || 1;//0;// -1;

		// var radius = this.conf.nodeRadius;
		// var circleShape = new p2.Circle(radius);
		// body.addShape(circleShape);
		if (this.group.structure.innerRadius)
		{
			var radius = this.group.structure.innerRadius;
			var circleShape = new p2.Circle(radius);
			body.addShape(circleShape);
		}
		else
		{
			// var particleShape = new p2.Particle();
			// body.addShape(particleShape);
			var circledShape = new p2.Circle(this.group.conf.nodeRadius);
			body.addShape(circledShape);
			// body.mass = nodeMass;
			// body.updateMassProperties();
		}

		//console.log(this.body.getArea());

		//this.body.setDensity(node.type === 'line' ? 1 : 5000);

		//body.damping = 1;
		//body.mass = mass;
		node.physicsManager = new NodeP2SoftPhysicsManager(p2, body, this.worldHeight);
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
		
		body.angularDamping = this.conf.angularDamping || body.angularDamping;
		body.damping = this.conf.damping || body.damping;
	}

	if (this.conf.structuralMassDecay) { this.setNodesMassFromJoints(); }
};

module.exports = GroupP2SoftPhysicsManager;

