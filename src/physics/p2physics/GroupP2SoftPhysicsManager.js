// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/*jshint camelcase:false*/

var p2 = require('../../../libs/p2');
var NodeP2SoftPhysicsManager = require('./NodeP2SoftPhysicsManager');

var GroupP2SoftPhysicsManager = function ($world, $worldHeight, $group, $conf)
{
	this.group = $group;
	this.world = $world;
	this.worldHeight = $worldHeight;
	this.conf = $conf;
	this.nodesDiameter = this.conf.nodesDiameter;
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
			this.world.addSpring(constraint4);
		}
	}
};

GroupP2SoftPhysicsManager.prototype.addNodesToWorld = function ()
{
	for (var i = 0, length = this.group.nodes.length; i < length; i += 1)
	{
		var node = this.group.nodes[i];
		//var mass = 500;
		var mass = this.conf.mass;//Math.random() * 10 + 1;
		this.body = new p2.Body({
			mass: node.fixed ? 0 : mass,
			position: [node.oX, this.worldHeight - node.oY]
		});
		//console.log(node.oX, node.oY);
		//this.body.fixedRotation = true;
		// this.body.gravityScale = -1;//0;// -1;

		// var radius = this.nodesDiameter;
		// var circleShape = new p2.Circle(radius);
		// this.body.addShape(circleShape);
		var particleShape = new p2.Particle();
		this.body.addShape(particleShape);

		//console.log(this.body.getArea());

		//this.body.setDensity(node.type === 'line' ? 1 : 5000);
		this.world.addBody(this.body);
		// this.body.damping = 0.8;

		node.physicsManager = new NodeP2SoftPhysicsManager(this.body, this.worldHeight);
		//node.physicsManager.applyForce([0, 0]);
	}
};

module.exports = GroupP2SoftPhysicsManager;

