var p2 = require('../../../libs/p2');
var P2Utils = {};

P2Utils.createConstraints = function ($world, $bodyA, $bodyB, $config, $options)
{
	if (!$config) { return; }

	var constraints = [];
	for (var i = 0, length = $config.length; i < length; i += 1)
	{
		var config = $config[i];

		var constraint;

		var notNullOrUndefined = function ($property)
		{
			return $property !== undefined && $property !== null;
		};

		switch (config.type)
		{
			case 'revoluteConstraint':
				var vecWorldA = p2.vec2.create();
				var vecWorldB = p2.vec2.create();
				var vecLocA = p2.vec2.create();
				var vecLocB = p2.vec2.create();
				$bodyA.toWorldFrame(vecWorldA, [0, 0]);
				$bodyB.toWorldFrame(vecWorldB, [0, 0]);
				$bodyA.toLocalFrame(vecLocA, $bodyB.interpolatedPosition);
				$bodyB.toLocalFrame(vecLocB, $bodyA.interpolatedPosition);

				// console.log(revolute.autoPivot);
				if (!$options || !$options[0] || !$options[1]) { config.autoPivot = true; }
				var localPivotA = config.autoPivot ? undefined : $options[0];
				var localPivotB = config.autoPivot ? undefined : $options[1];
				var worldPivot = config.autoPivot ? $bodyA.interpolatedPosition : undefined;
				constraint = new p2.RevoluteConstraint($bodyA, $bodyB,
				{
					worldPivot: worldPivot,
					localPivotA: localPivotA,
					localPivotB: localPivotB
				});
				if (!config.motor)
				{
					//constraint.setLimits(0, 0);
					if (config.collideConnected !== undefined) { constraint.collideConnected = config.collideConnected; }
				}
				else
				{
					constraint.enableMotor();
					constraint.setMotorSpeed(-1);
					constraint.collideConnected = false;
				}
				if (config.noRotation) { constraint.setLimits(0, 0); }
				if (notNullOrUndefined(config.stiffness)) { constraint.setStiffness(Number(config.stiffness)); } //default 20
				if (notNullOrUndefined(config.relaxation)) { constraint.setRelaxation(Number(config.relaxation)); }
				$world.addConstraint(constraint);
				constraints.push(constraint);

				break;
			case 'prismaticConstraint':
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
					upperLimit: notNullOrUndefined(config.upperLimit) ? Number(config.upperLimit) : 1,
					lowerLimit: notNullOrUndefined(config.lowerLimit) ? Number(config.lowerLimit) : 0,
					disableRotationalLock: config.canRotate === true ? true : false
				});
				if (config.collideConnected !== undefined) { constraint.collideConnected = config.collideConnected; }
				if (notNullOrUndefined(config.stiffness)) {
				console.log('not nullllll');
				constraint.setStiffness(Number(config.stiffness)); } //default 20
				if (notNullOrUndefined(config.relaxation)) { constraint.setRelaxation(Number(config.relaxation)); }
				$world.addConstraint(constraint);
				constraints.push(constraint);
				break;
			case 'lockConstraint':
				constraint = new p2.LockConstraint($bodyA, $bodyB);
				//if ($options && $options[0]) { constraint.localOffsetB = $options[0]; }
				if (config.collideConnected !== undefined) { constraint.collideConnected = config.collideConnected; }
				if (notNullOrUndefined(config.stiffness)) { constraint.setStiffness(Number(config.stiffness)); } //default 20
				if (notNullOrUndefined(config.relaxation)) { constraint.setRelaxation(Number(config.relaxation)); }
				$world.addConstraint(constraint);
				constraints.push(constraint);
				break;
			case 'linearSpring':
				constraint = new p2.LinearSpring($bodyA, $bodyB, {
					localAnchorA: $options && $options[0] ? $options[0] : undefined,
					localAnchorB: $options && $options[1] ? $options[1] : undefined
				});
				if (notNullOrUndefined(config.stiffness)) { constraint.stiffness = Number(config.stiffness); }
				if (notNullOrUndefined(config.damping)) { constraint.damping = Number(config.damping); }
				$world.addSpring(constraint);
				constraints.push(constraint);
				break;
			case 'rotationalSpring':
				constraint = new p2.RotationalSpring($bodyA, $bodyB);
				if (notNullOrUndefined(config.stiffness)) { constraint.stiffness = Number(config.stiffness); }
				if (notNullOrUndefined(config.damping)) { constraint.damping = Number(config.damping); }
				constraints.push(constraint);
				$world.addSpring(constraint);
				break;
			default:
				constraint = new p2.DistanceConstraint($bodyA, $bodyB);
				if ($options && $options[0]) { constraint.localAnchorA = $options[0]; }
				if ($options && $options[1]) { constraint.localAnchorB = $options[1]; }
				if (notNullOrUndefined(config.stiffness)) { constraint.setStiffness(Number(config.stiffness)); } // default 500
				if (notNullOrUndefined(config.relaxation)) { constraint.setRelaxation(Number(config.relaxation)); }// default 0.1
				$world.addConstraint(constraint);
				constraints.push(constraint);
				break;
		}
	}
	console.log(constraints);
	return constraints;
};

module.exports = P2Utils;
