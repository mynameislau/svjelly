var SVGParser = function () {};
SVGParser.prototype.parse = function ($world, $SVG)
{
	this.SVG = $SVG;
	this.viewBoxWidth = Number(this.SVG.getAttribute('viewBox').split(' ')[2]);
	this.viewBoxHeight = Number(this.SVG.getAttribute('viewBox').split(' ')[3]);
	this.ratio = $world.getWidth() / this.viewBoxWidth;
	this.world = $world;
	this.world.setHeight($world.getWidth() * this.ratio);

	//temp
	var groups = this.SVG.children;

	for (var i = 0, groupsLength = groups.length; i < groupsLength; i += 1)
	{
		var rawGroup = groups[i];
		var groupType = this.getGroupType(rawGroup);

		var currGroup = $world.createGroup(groupType);

		var elements = rawGroup.tagName === 'g' ? rawGroup.querySelectorAll('rect,polygon,polyline,path') : [rawGroup];
		this.parseElements(elements, currGroup);

		// if (currGroup.conf.structure !== 'ghost')
		// {
		this.parseAnchors(rawGroup, currGroup);
		this.parseCustomJoints(rawGroup, currGroup);
		// }
	}

	this.world.addGroupsToWorld();
};

SVGParser.prototype.getGroupType = function ($rawGroup)
{
	var name = /\w+/igm.exec($rawGroup.id);
	if (name) { return name[0]; }
	if ($rawGroup.querySelectorAll('polyline, path').length > 0 ||
		$rawGroup.tagName === 'polyline' ||
		$rawGroup.tagName === 'path')
	{
		return 'line';
	}
};

SVGParser.prototype.parseAnchors = function ($rawGroup, $group)
{
	var circles = $rawGroup.querySelectorAll('[id*="anchor"]');

	for (var i = 0, circlesLength = circles.length; i < circlesLength; i += 1)
	{
		var currCircle = circles[i];
		$group.createNode(this.getCoordX(currCircle.getAttribute('cx')), this.getCoordY(currCircle.getAttribute('cy')), { fixed: true }, true);
	}
};

SVGParser.prototype.parseElements = function ($elements, $group)
{
	for (var i = 0, elementsLength = $elements.length; i < elementsLength; i += 1)
	{
		var rawElement = $elements[i];
		var tagName = rawElement.tagName;

		var coordsArray;

		switch (tagName)
		{
			case 'rect':
				coordsArray = this.parseRect(rawElement);
			break;

			case 'polygon':
			case 'polyline':
				coordsArray = this.parsePoly(rawElement);
			break;

			case 'path':
				coordsArray = this.parsePath(rawElement);
			break;
		}
		var nodesToDraw = $group.structure.create(coordsArray);
		this.setGraphicInstructions($group, rawElement, nodesToDraw);
	}
};

SVGParser.prototype.setGraphicInstructions = function ($group, $rawElement, $nodes)
{
	for (var i = 0, length = $nodes.length; i < length; i += 1)
	{
		var currNode = $nodes[i];
		currNode.drawing = {};
		$group.nodes.splice($group.nodes.indexOf(currNode), 1);
		$group.nodes.splice(i, 0, currNode);
		// console.log($group.nodes.indexOf(currNode));
		// debugger;
	}
	var startNode = $nodes[0];
	var endNode = $nodes[$nodes.length - 1];

	var fill = $rawElement.getAttribute('fill') || '#000000';
	var stroke = $rawElement.getAttribute('stroke') || 'none';
	var lineWidth = $rawElement.getAttribute('stroke-width');
	var opacity = $rawElement.getAttribute('opacity');
	startNode.drawing.fill = fill;//fill === undefined ? 'none' : fill;
	startNode.drawing.stroke = stroke;
	startNode.drawing.lineWidth = lineWidth * this.ratio || 1 * this.ratio;//lineWidth === undefined ? 'none' : lineWidth * this.ratio;
	startNode.drawing.lineCap = $rawElement.getAttribute('stroke-linecap') || 'round';
	startNode.drawing.lineJoin = $rawElement.getAttribute('stroke-linejoin') || 'round';
	startNode.drawing.opacity = opacity ? opacity : undefined;
	//startNode.gradient = { x1: startNode.x, y1: startNode.y, x2: endNode.x, y2: endNode.y };
	//console.log(startNode, startNode.gradient);
	// debugger;
	var gradientStroke = /url\(#(.*)\)/im.exec(stroke);
	if (gradientStroke)
	{
		var gradient = [];
		// console.log(gradientStroke[1]);
		var stops = this.SVG.querySelectorAll('#' + gradientStroke[1] + '>stop');
		// console.log(stops);
		for (var k = 0, stopLength = stops.length; k < stopLength; k += 1)
		{
			var currStop = stops[k];
			var offset = Number(currStop.getAttribute('offset'));
			var color = currStop.getAttribute('style').match(/#[0-9A-F]+/im)[0];
			gradient.push({ offset: offset, color: color });
			startNode.drawing.strokeGradient = gradient;
			startNode.drawing.stroke = 'none';
		}
	}
	else
	{
		startNode.drawing.strokeGradient = 'none';
	}

	startNode.endNode = endNode;
	// startNode.drawing.stroke = stroke;
	// console.log('new start node', startNode.oX, startNode.oY, 'stroke : ', startNode.drawing.stroke);
	// startNode.drawing.strokeWidth = $rawElement.getAttribute('stroke-width') * this.ratio;
	startNode.isStart = true;
};

SVGParser.prototype.parseRect = function ($rawRect)
{
	var x1 = $rawRect.getAttribute('x') ? this.getCoordX($rawRect.getAttribute('x')) : 0;
	var y1 = $rawRect.getAttribute('y') ? this.getCoordY($rawRect.getAttribute('y')) : 0;
	var x2 = x1 + this.getCoordX($rawRect.getAttribute('width'));
	var y2 = y1 + this.getCoordY($rawRect.getAttribute('height'));
	var toReturn = [];
	toReturn.push([x1, y1]);
	toReturn.push([x1, y2]);
	toReturn.push([x2, y2]);
	toReturn.push([x2, y1]);
	return toReturn;
};

SVGParser.prototype.parsePoly = function ($rawPoly)
{
	var splits = $rawPoly.getAttribute('points').split(' ');
	var coordsArray = [];

	for (var i = 0, splitsLength = splits.length; i < splitsLength; i += 1)
	{
		var currSplit = splits[i];

		if (currSplit !== '')
		{
			var point = currSplit.split(',');
			var pointX = this.getCoordX(point[0]);
			var pointY = this.getCoordY(point[1]);
			var exists = false;
			for (var k = 0, otherCoordsArrayLength = coordsArray.length; k < otherCoordsArrayLength; k += 1)
			{
				var otherPoint = coordsArray[k];
				var otherX = otherPoint[0];
				var otherY = otherPoint[1];
				if (otherX === pointX && otherY === pointY)
				{
					exists = true;
				}
			}
			if (exists === false)
			{
				coordsArray.push([pointX, pointY]);
			}
		}
	}

	return coordsArray;
};

SVGParser.prototype.parsePath = function ($rawPath)
{
	var d = $rawPath.getAttribute('d');
	var pathReg = /([mlscvh])(-?[\d\.]*[,-]+[\d\.]*),?(-?[\d\.]*,?-?[\d\.]*),?(-?[\d\.]*,?-?[\d\.]*)/igm;
	var coordsArray = [];
	var lastCoordX = this.getCoordX(0);
	var lastCoordY = this.getCoordY(0);
	for (var array = pathReg.exec(d); array !== null; array = pathReg.exec(d))
	{
		var coordString;
		var numberCoordX;
		var numberCoordY;
		if (array[1] === 'v')
		{
			numberCoordX = lastCoordX;
			numberCoordY = lastCoordY + this.getCoordY(array[2]);
		}
		else if (array[1] === 'h')
		{
			numberCoordX = lastCoordX + this.getCoordY(array[2]);
			numberCoordY = lastCoordY;
		}
		else
		{
			if (array[4] !== '')
			{
				coordString = array[4];
			}
			else if (array[3] !== '')
			{
				coordString = array[3];
			}
			else
			{
				coordString = array[2];
			}
			var coordReg = /(-?\d+\.?\d*)/igm;
			var coords = coordString.match(coordReg);

			numberCoordX = lastCoordX + this.getCoordX(coords[0]);
			numberCoordY = lastCoordY + this.getCoordY(coords[1]);
		}
		//console.log(numberCoordX, numberCoordY);
		coordsArray.push([numberCoordX, numberCoordY]);

		lastCoordX = numberCoordX;
		lastCoordY = numberCoordY;
	}

	return coordsArray;
};

SVGParser.prototype.convertCoord = function ($coordSTR)
{
	var number = this.round($coordSTR);
	return number * this.ratio;
};

SVGParser.prototype.round = function ($number)
{
	// var number = Number($number);
	// return Math.floor(number * 100) / 100;
	return Math.floor(Number($number));
};

SVGParser.prototype.getCoordX = function ($coordSTR)
{
	var number = this.round($coordSTR);
	return number * this.ratio;
};

SVGParser.prototype.getCoordY = function ($coordSTR)
{
	var number = this.round($coordSTR);
	//number = this.viewBoxHeight - number;
	return number * this.ratio;
};

SVGParser.prototype.parseCustomJoints = function ($rawGroup, $group)
{
	var rawJoints = $rawGroup.querySelectorAll('[id*="joint"]');
	var rawJointsLength = rawJoints.length;

	for (var i = 0; i < rawJointsLength; i += 1)
	{
		var currRawJoint = rawJoints[i];
		var p1x = this.getCoordX(currRawJoint.getAttribute('x1'));
		var p1y = this.getCoordY(currRawJoint.getAttribute('y1'));
		var p2x = this.getCoordX(currRawJoint.getAttribute('x2'));
		var p2y = this.getCoordY(currRawJoint.getAttribute('y2'));

		$group.createJoint(p1x, p1y, p2x, p2y);
	}
};

module.exports = SVGParser;

