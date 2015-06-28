var p2 = require('../../../libs/p2');
var P2Utils = {};

P2Utils.createConstraints = function ($world, $bodyA, $bodyB, $config, $options)
{
	var lock = $config.lockConstraint;
	var distance = $config.distanceConstraint;
	var revolute = $config.revoluteConstraint;
	var linearSpring = $config.linearSpring;
	var rotationalSpring = $config.rotationalSpring;
	var constraints = [];
	var constraint;

	if (revolute)
	{
		var vecWorldA = p2.vec2.create();
		var vecWorldB = p2.vec2.create();
		var vecLocA = p2.vec2.create();
		var vecLocB = p2.vec2.create();
		$bodyA.toWorldFrame(vecWorldA, [0, 0]);
		$bodyB.toWorldFrame(vecWorldB, [0, 0]);
		$bodyA.toLocalFrame(vecLocA, $bodyB.position);
		$bodyB.toLocalFrame(vecLocB, $bodyA.position);

		constraint = new p2.RevoluteConstraint($bodyA, $bodyB,
		{
			worldPivot: $bodyA.interpolatedPosition
		});
		if (!revolute.motor)
		{
			constraint.setLimits(0, 0);
		}
		else
		{
			constraint.enableMotor();
			constraint.setMotorSpeed(0.5);
			constraint.collideConnected = false;
		}
		if (revolute.stiffness) { constraint.setStiffness(revolute.stiffness); } //default 20
		if (revolute.relaxation) { constraint.setRelaxation(revolute.relaxation); }
		$world.addConstraint(constraint);
		constraints.push(constraint);
	}
	if (lock)
	{
		constraint = new p2.LockConstraint($bodyA, $bodyB);
		//if ($options && $options[0]) { constraint.localOffsetB = $options[0]; }
		if (lock.stiffness) { constraint.setStiffness(lock.stiffness); } //default 20
		if (lock.relaxation) { constraint.setRelaxation(lock.relaxation); }
		$world.addConstraint(constraint);
		constraints.push(constraint);
	}
	if (linearSpring)
	{
		constraint = new p2.LinearSpring($bodyA, $bodyB);
		if (linearSpring.stiffness) { constraint.stiffness = linearSpring.stiffness; }
		if (linearSpring.damping) { constraint.damping = linearSpring.damping; }
		$world.addSpring(constraint);
		constraints.push(constraint);
	}
	if (rotationalSpring)
	{
		constraint = new p2.RotationalSpring($bodyA, $bodyB);
		if (rotationalSpring.stiffness) { constraint.stiffness = rotationalSpring.stiffness; }
		if (rotationalSpring.damping) { constraint.damping = rotationalSpring.damping; }
		constraints.push(constraint);
		//$world.addSpring(constraint);
	}
	if (distance)
	{
		constraint = new p2.DistanceConstraint($bodyA, $bodyB);
		if ($options && $options[0]) { constraint.localAnchorA = $options[0]; }
		if ($options && $options[1]) { constraint.localAnchorB = $options[1]; }
		if (distance && distance.stiffness) { constraint.setStiffness(distance.stiffness); } // default 500
		if (distance && distance.relaxation) { constraint.setRelaxation(distance.relaxation); }// default 0.1
		$world.addConstraint(constraint);
		constraints.push(constraint);
	}

	return constraints;
};

module.exports = P2Utils;
