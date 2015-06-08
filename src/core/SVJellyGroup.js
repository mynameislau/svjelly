var SVJellyNode = require('./SVJellyNode');
var SVJellyJoint = require('./SVJellyJoint');

var SVJellyGroup = function ($type, $conf)
{
	this.physicsManager = undefined;
	this.conf = $conf;
	this.type = $type;
	this.nodes = [];
	this.joints = [];
};

SVJellyGroup.prototype.getNodeAtPoint = function ($x, $y)
{
	for (var i = 0, nodesLength = this.nodes.length; i < nodesLength; i += 1)
	{
		var node = this.nodes[i];

		if (node.oX === $x && node.oY === $y)
		{
			return node;
		}
	}
};

SVJellyGroup.prototype.createNode = function ($px, $py, $options, $overwrite)
{
	var node = this.getNodeAtPoint($px, $py);
	if (node !== undefined && $overwrite)
	{
		node.setOptions($options);
	}
	else
	{
		node = new SVJellyNode($px, $py, $options);
		this.nodes.push(node);
	}

	//this.physicsManager.addNodeToWorld(node);

	return node;
};

SVJellyGroup.prototype.getBoundingBox = function ()
{
	var minX;
	var maxX;
	var minY;
	var maxY;
	for (var i = 0, length = this.nodes.length; i < length; i += 1)
	{
		var node = this.nodes[i];
		minX = minX > node.oX || minX === undefined ? node.oX : minX;
		maxX = maxX < node.oX || maxX === undefined ? node.oX : maxX;
		minY = minY > node.oY || minY === undefined ? node.oY : minY;
		maxY = maxY < node.oY || maxY === undefined ? node.oY : maxY;
	}
	return [[minX, minY], [maxX, maxY]];
};

SVJellyGroup.prototype.createJoint = function ($p1x, $p1y, $p2x, $p2y)
{
	var node1 = this.getNodeAtPoint($p1x, $p1y);
	var node2 = this.getNodeAtPoint($p2x, $p2y);

	for (var i = 0, jointsLength = this.joints.length; i < jointsLength; i += 1)
	{
		var currJoint = this.joints[i];
		if ((currJoint.node1 === node1 && currJoint.node2 === node2) || (currJoint.node2 === node1 && currJoint.node1 === node2))
		{
			return;
		}
	}

	if (node1 === undefined)
	{
		node1 = this.createNode($p1x, $p1y);
	}

	if (node2 === undefined)
	{
		node2 = this.createNode($p2x, $p2y);
	}

	var joint = new SVJellyJoint(node1, node2);

	this.joints.push(joint);

	//this.physicsManager.addJointToWorld(joint);
};

SVJellyGroup.prototype.createNodesFromPoints = function ($coordsArray)
{
	var coordsArrayLength = $coordsArray.length;
	var toReturn = [];
	for (var i = 0; i < coordsArrayLength; i += 1)
	{
		var currPoint = $coordsArray[i];
		toReturn.push(this.createNode(currPoint[0], currPoint[1], undefined, false));
	}
	return toReturn;
};

SVJellyGroup.prototype.createJointsFromPoints = function ($coordsArray, $noClose)
{
	var coordsArrayLength = $coordsArray.length;
	for (var i = 1; i < coordsArrayLength; i += 1)
	{
		var currPoint = $coordsArray[i];
		var lastPoint = $coordsArray[i - 1];
		this.createJoint(lastPoint[0], lastPoint[1], currPoint[0], currPoint[1]);
		if (i === coordsArrayLength - 1 && $noClose !== true)
		{
			this.createJoint(currPoint[0], currPoint[1], $coordsArray[0][0], $coordsArray[0][1]);
		}
	}
};

SVJellyGroup.prototype.addNodesToWorld = function ()
{
	this.physicsManager.addNodesToWorld();
};

SVJellyGroup.prototype.addJointsToWorld = function ()
{
	this.physicsManager.addJointsToWorld();
};

module.exports = SVJellyGroup;

