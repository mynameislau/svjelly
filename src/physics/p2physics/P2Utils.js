var p2 = require('../../../libs/p2');
var P2Utils = {};

P2Utils.createConstraints = function ($world, $bodyA, $bodyB, $config, $options)
{
	if (!$config) { return; }

	var lock = $config.lockConstraint;
	var distance = $config.distanceConstraint;
	var revolute = $config.revoluteConstraint;
	var linearSpring = $config.linearSpring;
	var prismaticConstraint = $config.prismaticConstraint;
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

		// console.log(revolute.autoPivot);
		if (!$options || !$options[0] || !$options[1]) { revolute.autoPivot = true; }
		var localPivotA = revolute.autoPivot ? undefined : $options[0];
		var localPivotB = revolute.autoPivot ? undefined : $options[1];
		var worldPivot = revolute.autoPivot ? $bodyA.interpolatedPosition : undefined;
		constraint = new p2.RevoluteConstraint($bodyA, $bodyB,
		{
			worldPivot: worldPivot,
			localPivotA: localPivotA,
			localPivotB: localPivotB
		});
		if (!revolute.motor)
		{
			//constraint.setLimits(0, 0);
			if (revolute.collideConnected !== undefined) { constraint.collideConnected = revolute.collideConnected; }
		}
		else
		{
			constraint.enableMotor();
			constraint.setMotorSpeed(-1);
			constraint.collideConnected = false;
		}
		if (revolute.stiffness) { constraint.setStiffness(revolute.stiffness); } //default 20
		if (revolute.relaxation) { constraint.setRelaxation(revolute.relaxation); }
		$world.addConstraint(constraint);
		constraints.push(constraint);
	}
	if (prismaticConstraint)
	{
		var axisVec = p2.vec2.create();
		var worldOffsetB = p2.vec2.create();
		$bodyB.toWorldFrame(worldOffsetB, $options[1]);
		$bodyA.toLocalFrame(axisVec, worldOffsetB);//[$bodyB.interpolatedPosition[0] + $options[1][0] - ($bodyA.interpolatedPosition[0] + $options[0][0]), $bodyB.interpolatedPosition[1] - $bodyA.interpolatedPosition[1]];
		var sx = axisVec[0] - $options[0][0];
		var sy = axisVec[1] - $options[0][1];
		// var cx = Math.abs(sx);
		// var cy = Math.abs(sy);
		// var dist = Math.sqrt(cx * cx + cy * cy);
		//console.log(axisVec, $options[0]);
		//debugger;
		constraint = new p2.PrismaticConstraint($bodyA, $bodyB, {
			localAnchorA: $options[0],
			localAnchorB: $options[1],
			localAxisA: [sx, sy],
			upperLimit: 1,
			lowerLimit: 0,
			disableRotationalLock: prismaticConstraint.canRotate === true ? true : false
		});
		$world.addConstraint(constraint);
		constraints.push(constraint);
	}
	if (lock)
	{
		constraint = new p2.LockConstraint($bodyA, $bodyB);
		//if ($options && $options[0]) { constraint.localOffsetB = $options[0]; }
		if (lock.collideConnected !== undefined) { constraint.collideConnected = lock.collideConnected; }
		if (lock.stiffness) { constraint.setStiffness(lock.stiffness); } //default 20
		if (lock.relaxation) { constraint.setRelaxation(lock.relaxation); }
		$world.addConstraint(constraint);
		constraints.push(constraint);
	}
	if (linearSpring)
	{
		constraint = new p2.LinearSpring($bodyA, $bodyB, {
			localAnchorA: $options[0],
			localAnchorB: $options[1]
		});
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
