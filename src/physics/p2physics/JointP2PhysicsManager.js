//var p2 = require('../../../libs/p2');
var P2Utils = require('./P2Utils');

var JointP2PhysicsManager = function ($joint, $world, $conf)
{
	var jointConf = $conf.joints[$joint.type];
	var bodyA = $joint.nodeA.physicsManager.body;
	var bodyB = $joint.nodeB.physicsManager.body;
	this.constraints = P2Utils.createConstraints($world, bodyA, bodyB, jointConf);
};

module.exports = JointP2PhysicsManager;
