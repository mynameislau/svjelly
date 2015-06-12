var Triangulator = require('./Triangulator');
var Polygon = require('./Polygon');
var Grid = require('./Grid');

var Structure = function ($group, $world)
{
	this.world = $world;
	this.group = $group;
	this.innerStructure = undefined;
};

Structure.prototype.create = function ($properties)
{
	var nodesToDraw;
	var points = $properties.points;
	this.group.structureProperties = $properties;

	if ($properties.type === 'polygon')
	{
		var polygon = Polygon.init(points);
		this.group.structureProperties.area = polygon.getArea();
	}
	else if ($properties.type === 'line')
	{
		var area = 0;
		for (var i = 1, length = this.points.length; i < length; i += 1)
		{
			var currPoint = this.points[i];
			var lastPoint = this.points[i - 1];
			var dX = Math.abs(currPoint[0] - lastPoint[0]);
			var dY = Math.abs(currPoint[1] - lastPoint[1]);
			area += Math.sqrt(dX * dX + dY * dY);
		}
		this.group.structureProperties.area = area;
	}
	else if ($properties.type === 'circle')
	{
		this.group.structureProperties.area = Math.pow(Math.PI * $properties.radius, 2);
	}

	switch (this.group.conf.structure)
	{
		case 'triangulate':
			nodesToDraw = this.group.createNodesFromPoints(points);
			this.createJointsFromTriangles(points);
			break;
		case 'line':
			nodesToDraw = this.group.createNodesFromPoints(points);
			this.group.createJointsFromPoints(points, true);
			//nodesToDraw[0].fixed = true;//to remove later maybe ?
			break;
		case 'preciseHexaFill':
			nodesToDraw = this.createPreciseHexaFillStructure(points);
			// structureNodes.forEach(function ($element) { $element.drawing = { notToDraw: true }; });
			break;
		case 'hexaFill':
			nodesToDraw = this.createHexaFillStructure(points);
			break;
		default:
			nodesToDraw = this.group.createNodesFromPoints(points);
			break;
	}

	return nodesToDraw;
};

Structure.prototype.createHexaFillStructure = function ($coordsArray)
{
	this.createInnerStructure($coordsArray);
	var path = this.innerStructure.getShapePath();
	var nodesToDraw = [];
	for (var i = 0, length = path.length; i < length; i += 1)
	{
		nodesToDraw.push(this.group.getNodeAtPoint(path[i][0], path[i][1]));
	}
	return nodesToDraw;
};

Structure.prototype.createPreciseHexaFillStructure = function ($coordsArray)
{
	var nodesToDraw = this.group.createNodesFromPoints($coordsArray);
	this.createInnerStructure($coordsArray);

	this.group.createJointsFromPoints($coordsArray, false);
	var i = 0;
	var length = $coordsArray.length;
	for (i; i < length; i += 1)
	{
		var currPoint = $coordsArray[i];
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

Structure.prototype.createJointsFromTriangles = function ($coordsArray)
{
	var triangulator = new Triangulator();
	var triangles = triangulator.triangulate($coordsArray);

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

Structure.prototype.createInnerStructure = function ($coordsArray)
{
	var polygon = Polygon.init($coordsArray);
	var diam = this.world.getWidth() * this.group.conf.innerStructureDef;//width / 10;//this.world.getWidth() / 30;
	this.innerStructure = Grid.createFromPolygon(polygon, diam, true);
	var structureNodes = this.group.createNodesFromPoints(this.innerStructure.getNodesArray());

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

module.exports = Structure;

