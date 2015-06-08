var Triangulator = require('./Triangulator');
var Polygon = require('./Polygon');
var Grid = require('./Grid');

var Structure = function ($group, $world)
{
	this.world = $world;
	this.group = $group;
	this.innerStructure = undefined;
};

Structure.prototype.create = function ($coordsArray)
{
	var nodesToDraw;

	switch (this.group.conf.structure)
	{
		case 'triangulate':
			nodesToDraw = this.group.createNodesFromPoints($coordsArray);
			this.createJointsFromTriangles($coordsArray);
			break;
		case 'line':
			nodesToDraw = this.group.createNodesFromPoints($coordsArray);
			this.group.createJointsFromPoints($coordsArray, true);
			nodesToDraw[0].fixed = true;//to remove later maybe ?
			break;
		case 'preciseHexaFill':
			nodesToDraw = this.createPreciseHexaFillStructure($coordsArray);
			// structureNodes.forEach(function ($element) { $element.drawing = { notToDraw: true }; });
			break;
		case 'hexaFill':
			nodesToDraw = this.createHexaFillStructure($coordsArray);
			break;
		default:
			nodesToDraw = this.group.createNodesFromPoints($coordsArray);
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
			this.group.createJoint(currPoint[0], currPoint[1], currClosest[0], currClosest[1]);
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
		this.group.createJoint(currTriangle[0].x, currTriangle[0].y, currTriangle[1].x, currTriangle[1].y);
		this.group.createJoint(currTriangle[1].x, currTriangle[1].y, currTriangle[2].x, currTriangle[2].y);
		this.group.createJoint(currTriangle[2].x, currTriangle[2].y, currTriangle[0].x, currTriangle[0].y);
	}
};

Structure.prototype.createInnerStructure = function ($coordsArray)
{
	var polygon = Object.create(Polygon).init($coordsArray);
	var diam = this.world.getWidth() * this.group.conf.innerStructureDef;//width / 10;//this.world.getWidth() / 30;
	this.innerStructure = Grid.createFromPolygon(polygon, diam, true);
	var structureNodes = this.group.createNodesFromPoints(this.innerStructure.getNodesArray());

	var network = this.innerStructure.getNetwork();
	var i = 0;
	var length = network.length;
	for (i; i < length; i += 1)
	{
		var currLink = network[i];
		this.group.createJoint(currLink[0][0], currLink[0][1], currLink[1][0], currLink[1][1]);
	}
	return structureNodes;
};

module.exports = Structure;

