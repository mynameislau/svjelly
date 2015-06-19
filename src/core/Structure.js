var Triangulator = require('./Triangulator');
var Polygon = require('./Polygon');
var Grid = require('./Grid');
var Commands = require('./Commands');

var Structure = function ($group, $world)
{
	this.world = $world;
	this.group = $group;
	this.innerStructure = undefined;
};

Structure.prototype.create = function ($drawingCommands)
{
	var nodesToDraw;

	this.points = this.getPoints($drawingCommands);
	this.drawingCommands = $drawingCommands;

	// console.log('points', points.length, this.group.conf.structure);

	this.area = this.calculateArea(this.points, $drawingCommands);
	this.radiusX = $drawingCommands.radiusX;
	this.radiusY = $drawingCommands.radiusY;

	switch (this.group.conf.structure)
	{
		case 'triangulate':
			this.removeDuplicates(this.drawingCommands);
			var triPoints = this.getPoints(this.drawingCommands);
			nodesToDraw = this.createNodesFromPoints(triPoints);
			this.setNodeDrawingCommands(nodesToDraw);
			this.createJointsFromTriangles(triPoints);
			break;
		case 'line':
			nodesToDraw = this.createNodesFromPoints(this.points);
			this.setNodeDrawingCommands(nodesToDraw);
			this.createJointsFromPoints(this.points, true);
			//nodesToDraw[0].fixed = true;//to remove later maybe ?
			break;
		case 'preciseHexaFill':
			nodesToDraw = this.createPreciseHexaFillStructure(this.points);
			// structureNodes.forEach(function ($element) { $element.drawing = { notToDraw: true }; });
			break;
		case 'hexaFill':
			nodesToDraw = this.createHexaFillStructure(this.points);
			break;
		default:
			nodesToDraw = this.createNodesFromPoints(this.points);
			this.setNodeDrawingCommands(nodesToDraw);
			break;
	}

	return nodesToDraw;
};

Structure.prototype.calculateArea = function ($points, $drawingCommands)
{
	if ($drawingCommands.type === 'ellipse')
	{
		return Math.pow(Math.PI * $drawingCommands.radiusX, 2);
	}
	if (this.group.conf.structure !== 'line')
	{
		var polygon = Polygon.init($points);
		return polygon.getArea();
	}
	else
	{
		var area = 0;
		for (var i = 1, length = $points.length; i < length; i += 1)
		{
			var currPoint = $points[i];
			var lastPoint = $points[i - 1];
			var dX = Math.abs(currPoint[0] - lastPoint[0]);
			var dY = Math.abs(currPoint[1] - lastPoint[1]);
			area += Math.sqrt(dX * dX + dY * dY);
		}
		return area;
	}
};

Structure.prototype.createHexaFillStructure = function ($points)
{
	this.createInnerStructure($points);
	var path = this.innerStructure.getShapePath();
	var nodesToDraw = [];
	for (var i = 0, length = path.length; i < length; i += 1)
	{
		var node = this.group.getNodeAtPoint(path[i][0], path[i][1]);
		nodesToDraw.push(node);
		node.drawing = {};
		node.drawing.command = i === 0 ? Commands.MOVE_TO : Commands.LINE_TO;
		node.drawing.point = [path[i][0], path[i][1]];
		node.drawing.options = [];
	}
	return nodesToDraw;
};

Structure.prototype.setNodeDrawingCommands = function ($nodes)
{
	for (var i = 0, length = $nodes.length; i < length; i += 1)
	{
		var node = $nodes[i];
		node.drawing = this.drawingCommands.pointCommands[i];
	}
};

Structure.prototype.createPreciseHexaFillStructure = function ($points)
{
	var nodesToDraw = this.createNodesFromPoints($points);
	this.setNodeDrawingCommands(nodesToDraw);
	this.createInnerStructure($points);

	this.createJointsFromPoints($points, false);
	var i = 0;
	var length = $points.length;
	for (i; i < length; i += 1)
	{
		var currPoint = $points[i];
		var closest = this.innerStructure.getClosest(currPoint[0], currPoint[1], 2);
		for (var k = 0, closestLength = closest.length; k < closestLength; k += 1)
		{
			var currClosest = closest[k];
			var n1 = this.group.getNodeAtPoint(currPoint[0], currPoint[1]);
			var n2 = this.group.getNodeAtPoint(currClosest[0], currClosest[1]);
			this.group.createJoint(n1, n2);
		}
	}
	return nodesToDraw;
};

Structure.prototype.createJointsFromTriangles = function ($points)
{
	var triangulator = new Triangulator();
	var triangles = triangulator.triangulate($points);

	var trianglesLength = triangles.length;
	for (var i = 0; i < trianglesLength; i += 1)
	{
		var currTriangle = triangles[i];
		var n0 = this.group.getNodeAtPoint(currTriangle[0].x, currTriangle[0].y);
		var n1 = this.group.getNodeAtPoint(currTriangle[1].x, currTriangle[1].y);
		var n2 = this.group.getNodeAtPoint(currTriangle[2].x, currTriangle[2].y);
		this.group.createJoint(n0, n1);
		this.group.createJoint(n1, n2);
		this.group.createJoint(n2, n0);
	}
};

Structure.prototype.getPoints = function ($drawingCommands)
{
	var points = [];
	for (var i = 0, length = $drawingCommands.pointCommands.length; i < length; i += 1)
	{
		var curr = $drawingCommands.pointCommands[i];
		points.push(curr.point);
	}
	return points;
};

Structure.prototype.createNodesFromPoints = function ($points)
{
	var pointsLength = $points.length;
	var toReturn = [];
	for (var i = 0; i < pointsLength; i += 1)
	{
		var currPoint = $points[i];
		var node = this.group.createNode(currPoint[0], currPoint[1], undefined, false);
		toReturn.push(node);
	}
	return toReturn;
};

Structure.prototype.removeDuplicates = function ($drawingCommands)
{
	var visitedPoints = [];
	var commands = $drawingCommands.pointCommands;
	for (var i = 0; i < commands.length; i += 1)
	{
		var point = commands[i].point;
		for (var k = 0; k < visitedPoints.length; k += 1)
		{
			var visited = visitedPoints[k];
			if (visited[0] === point[0] && visited[1] === point[1])
			{
				console.log(i, 'duplicate found !', visited[0], visited[1], point[0], point[1]);
				commands.splice(i, 1);
				i = i - 1;
			}
		}
		visitedPoints.push(point);
	}
};

Structure.prototype.createInnerStructure = function ($points)
{
	var polygon = Polygon.init($points);
	var diam = this.world.getWidth() * this.group.conf.innerStructureDef;//width / 10;//this.world.getWidth() / 30;
	this.innerRadius = diam / 2;
	this.innerStructure = Grid.createFromPolygon(polygon, diam, true);
	var structureNodes = this.createNodesFromPoints(this.innerStructure.getNodesArray());

	var network = this.innerStructure.getNetwork();
	var i = 0;
	var length = network.length;
	for (i; i < length; i += 1)
	{
		var currLink = network[i];
		var n1 = this.group.getNodeAtPoint(currLink[0][0], currLink[0][1]);
		var n2 = this.group.getNodeAtPoint(currLink[1][0], currLink[1][1]);
		this.group.createJoint(n1, n2);
	}
	return structureNodes;
};

Structure.prototype.createJointsFromPoints = function ($points, $noClose)
{
	var pointsLength = $points.length;
	for (var i = 1; i < pointsLength; i += 1)
	{
		var currPoint = $points[i];
		var lastPoint = $points[i - 1];
		var lastNode = this.group.getNodeAtPoint(lastPoint[0], lastPoint[1]);
		var currNode = this.group.getNodeAtPoint(currPoint[0], currPoint[1]);
		this.group.createJoint(lastNode, currNode);
		if (i === pointsLength - 1 && $noClose !== true)
		{
			var firstNode = this.group.getNodeAtPoint($points[0][0], $points[0][1]);
			this.group.createJoint(currNode, firstNode);
		}
	}
};

module.exports = Structure;

