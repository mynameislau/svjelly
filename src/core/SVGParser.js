var Commands = require('./Commands');
var ARC = Commands.ARC;
var LINE_TO = Commands.LINE_TO;
var MOVE_TO = Commands.MOVE_TO;
var BEZIER_TO = Commands.BEZIER_TO;
var QUADRA_TO = Commands.QUADRA_TO;
var ELLIPSE = Commands.ELLIPSE;

var SVGParser = function () {};
//var isPolygon = /polygon|rect/ig;
// var isLine = /polyline|line|path/ig;
// var lineTags = 'polyline, line, path';

SVGParser.prototype.parse = function ($world, $SVG)
{
	this.SVG = $SVG;
	var viewBoxAttr = this.SVG.getAttribute('viewBox');
	this.viewBoxWidth = viewBoxAttr ? Number(viewBoxAttr.split(' ')[2]) : Number(this.SVG.getAttribute('width'));
	this.viewBoxHeight = viewBoxAttr ? Number(viewBoxAttr.split(' ')[3]) : Number(this.SVG.getAttribute('height'));
	this.ratio = $world.getWidth() / this.viewBoxWidth;
	this.world = $world;
	this.world.setHeight(this.viewBoxHeight * this.ratio);

	//temp
	this.elementsQuery = '*:not(defs):not(g):not(title):not(linearGradient):not(radialGradient):not(stop):not([id*="joint"]):not([id*="constraint"])';
	var elemRaws = this.SVG.querySelectorAll(this.elementsQuery);

	var i = 0;
	var rawGroupPairings = [];
	var elemsLength = elemRaws.length;

	for (i = 0; i < elemsLength; i += 1)
	{
		var rawElement = elemRaws[i];
		//if (rawElement.nodeType === 3) { continue; }
		var groupInfos = this.getGroupInfos(rawElement);
		var currGroup = $world.createGroup(groupInfos.type, groupInfos.ID);
		currGroup.rawSVGElement = rawElement;

		//var elements = rawElement;
		//this.parseElements(elements, currGroup);

		var drawingCommands = this.parseElement(rawElement);
		var nodesToDraw = currGroup.structure.create(drawingCommands);
		this.setGraphicInstructions(currGroup, rawElement, nodesToDraw, drawingCommands);

		// var hasGroup;
		// for (var k = 0, length = rawGroupPairings.length; k < length; k += 1)
		// {
		// 	var curr = rawGroupPairings[k];
		// 	if (curr.group === currGroup)
		// 	{
		// 		hasGroup = true;
		// 		break;
		// 	}
		// }
		// if (!hasGroup) { rawGroupPairings.push({ group: currGroup, raw: rawElement.parentNode }); }
		rawGroupPairings.push({ group: currGroup, raw: rawElement.parentNode });
	}

	// var pairingsLength = rawGroupPairings.length;
	// for (i = 0; i < pairingsLength; i += 1)
	// {
	// 	var pairing = rawGroupPairings[i];
	// 	// this.parseAnchors(pairing.raw, pairing.group);
	// 	this.parseConstraints(pairing.raw, pairing.group);
	// 	this.parseCustomJoints(pairing.raw, pairing.group);
	// }

	this.parseConstraints();

	this.world.addGroupsToWorld();
};

SVGParser.prototype.getGroupInfos = function ($rawGroup)
{
	var groupElement = (!$rawGroup.id || $rawGroup.id.indexOf('svg') === 0) && $rawGroup.parentNode.tagName !== 'svg' ? $rawGroup.parentNode : $rawGroup;
	var type;
	var ID;
	var regex = /([a-z\d]+)\w*/igm;
	var first = regex.exec(groupElement.id);
	var second = regex.exec(groupElement.id);
	//if (first) { type = second ? second[1] : first[1]; }
	//var groupType = groupElement.id.match();
	//if (groupType) { return groupType[1] || groupType[0]; }
	//automatic for lines
	// if (!first && (groupElement.querySelectorAll(lineTags).length > 0 || groupElement.tagName.search(isLine) > -1))
	// {
	// 	type = 'line';
	// }
	type = first ? first[1] : undefined;
	ID = second ? second[1] : null;
	var title = groupElement.querySelector('title');
	if (ID === null) { ID = title ? title.nodeValue : ID; }
	// if ($rawGroup.parentNode.id === 'tree-tree')
	// {
	// 	console.log($rawGroup, $rawGroup.id, type, ID);
	// 	debugger;
	// }
	return { ID: ID, type: type };
};

SVGParser.prototype.getPoints = function ($pointCommands)
{
	var points = [];
	for (var i = 0, length = $pointCommands.length; i < length; i += 1)
	{
		var currPointCommand = $pointCommands[i];
		points.push(currPointCommand.point);
	}
	return points;
};

SVGParser.prototype.getGroupFromRawSVGElement = function ($raw)
{
	for (var i = 0, length = this.world.groups.length; i < length; i += 1)
	{
		var currGroup = this.world.groups[i];
		if (currGroup.rawSVGElement === $raw) { return currGroup; }
	}
};

SVGParser.prototype.parseConstraints = function ()
{
	var rawConstraints = this.SVG.querySelectorAll('[id*="constraint"]');
	for (var i = 0, length = rawConstraints.length; i < length; i += 1)
	{
		var currRawConstraint = rawConstraints[i];
		var rawElements = currRawConstraint.parentNode.querySelectorAll(this.elementsQuery);
		var points = this.getPoints(this.parseElement(currRawConstraint).pointCommands);
		var result = /constraint-([a-z\d]*)/ig.exec(currRawConstraint.id);
		var parentGroupID = result ? result[1] : undefined;
		var parentGroup = parentGroupID ? this.world.getGroupByID(parentGroupID) : undefined;

		for (var k = 0, rawElementsLength = rawElements.length; k < rawElementsLength; k += 1)
		{
			var currRawElement = rawElements[k];
			var group = this.getGroupFromRawSVGElement(currRawElement);
			//console.log(group);
			this.world.constrainGroups(group, parentGroup, points);
		}
	}
	// var children = $rawGroup.childNodes;//$rawGroup.querySelectorAll('[id*="constraint"]');

	// for (var i = 0, childrenLength = children.length; i < childrenLength; i += 1)
	// {
	// 	if (children[i].nodeType === Node.TEXT_NODE || children[i].id.search(/constraint/i) < 0) { continue; }
	// 	var currConstraint = children[i];
	// 	var result = /constraint-([a-z\d]*)/ig.exec(currConstraint.id);

	// 	var parentGroupID = result ? result[1] : undefined;
	// 	var parentGroup = parentGroupID ? this.world.getGroupByID(parentGroupID) : undefined;
	// 	var pointCommands = this.parseElement(currConstraint).pointCommands;
	// 	// console.log($group.ID, parentGroup ? parentGroup.ID : undefined);
	// 	this.world.constrainGroups($group, parentGroup, this.getPoints(pointCommands));
	// }
};

// SVGParser.prototype.parseElements = function ($elements, $group)
// {
// 	for (var i = 0, elementsLength = $elements.length; i < elementsLength; i += 1)
// 	{
// 		var rawElement = $elements[i];

// 		var element = this.parseElement(rawElement);

// 		var nodesToDraw = $group.structure.create(element);
// 		this.setGraphicInstructions($group, rawElement, nodesToDraw, element);
// 	}
// };

SVGParser.prototype.parseElement = function ($rawElement)
{
	var tagName = $rawElement.tagName;

	switch (tagName)
	{
		case 'line':
			return this.parseLine($rawElement);
		case 'rect':
			return this.parseRect($rawElement);

		case 'polygon':
		case 'polyline':
			return this.parsePoly($rawElement);

		case 'path':
			return this.parsePath($rawElement);

		case 'circle':
		case 'ellipse':
			return this.parseCircle($rawElement);
	}
};

SVGParser.prototype.setGraphicInstructions = function ($group, $raw, $nodesToDraw, $drawingCommands)
{
	var drawing = $group.drawing = {};
	drawing.nodes = $nodesToDraw;
	var props = drawing.properties = {};
	//ordering nodesToDraw so the path is drawn correctly
	for (var i = 0, length = $nodesToDraw.length; i < length; i += 1)
	{
		var currNode = $nodesToDraw[i];
		$group.nodes.splice($group.nodes.indexOf(currNode), 1);
		$group.nodes.splice(i, 0, currNode);
	}
	drawing.startNode = $nodesToDraw[0];
	drawing.endNode = $nodesToDraw[$nodesToDraw.length - 1];

	$nodesToDraw[0].drawing.isStart = true;
	$nodesToDraw[$nodesToDraw.length - 1].drawing.isEnd = true;
	$nodesToDraw[0].drawing.endNode = $nodesToDraw[$nodesToDraw.length - 1];

	var rawFill = $raw.getAttribute('fill');
	var rawStrokeWidth = $raw.getAttribute('stroke-width');
	var rawStroke = $raw.getAttribute('stroke');
	var rawLinecap = $raw.getAttribute('stroke-linecap');
	var rawLinejoin = $raw.getAttribute('stroke-linejoin');
	var rawOpacity = $raw.getAttribute('opacity');

	props.fill = rawFill || '#000000';
	props.lineWidth = rawStrokeWidth * this.ratio || 0;
	props.stroke = rawStroke && props.lineWidth !== 0 ? rawStroke : 'none';
	props.lineCap = rawLinecap && rawLinecap !== 'null' ? rawLinecap : 'butt';
	props.lineJoin = rawLinejoin && rawLinejoin !== 'null' ? rawLinejoin : 'miter';
	props.opacity = rawOpacity || 1;

	props.closePath = $drawingCommands.closePath;

	props.radiusX = $drawingCommands.radiusX;
	props.radiusY = $drawingCommands.radiusY;

	props.strokeGradient = this.getGradient(props.stroke);
	props.dynamicGradient = $group.conf.structure === 'line' && props.strokeGradient;
	props.fillGradient = this.getGradient(props.fill);
};

SVGParser.prototype.getGradient = function ($value)
{
	var gradientID = /url\(#(.*)\)/im.exec($value);
	if (gradientID)
	{
		var gradientElement = this.SVG.querySelector('#' + gradientID[1]);
		var m = this.getMatrix(gradientElement.getAttribute('gradientTransform'));

		if (gradientElement.tagName !== 'linearGradient' && gradientElement.tagName !== 'radialGradient') { return; }

		var gradient = { stops: [], type: gradientElement.tagName };

		if (gradientElement.tagName === 'linearGradient')
		{
			gradient.x1 = this.getCoord(gradientElement.getAttribute('x1'));
			gradient.y1 = this.getCoord(gradientElement.getAttribute('y1'));
			gradient.x2 = this.getCoord(gradientElement.getAttribute('x2'));
			gradient.y2 = this.getCoord(gradientElement.getAttribute('y2'));

			if (m)
			{
				var tfX1 = m[0] * gradient.x1 + m[1] * gradient.y1 + m[2];
				var tfY1 = m[3] * gradient.x1 + m[4] * gradient.y1 + m[5];
				var tfX2 = m[0] * gradient.x2 + m[1] * gradient.y2 + m[2];
				var tfY2 = m[3] * gradient.x2 + m[4] * gradient.y2 + m[5];

				gradient.x1 = tfX1;
				gradient.y1 = tfY1;
				gradient.x2 = tfX2;
				gradient.y2 = tfY2;
			}
		}
		if (gradientElement.tagName === 'radialGradient')
		{
			gradient.cx = this.getCoord(gradientElement.getAttribute('cx'));
			gradient.cy = this.getCoord(gradientElement.getAttribute('cy'));
			gradient.fx = gradientElement.getAttribute('fx') ? this.getCoord(gradientElement.getAttribute('fx')) : gradient.cx;
			gradient.fy = gradientElement.getAttribute('fy') ? this.getCoord(gradientElement.getAttribute('fy')) : gradient.cy;
			gradient.r = this.getCoord(gradientElement.getAttribute('r'));

			if (m)
			{
				var tfCX = m[0] * gradient.cx + m[1] * gradient.cy + m[2];
				var tfCY = m[3] * gradient.cx + m[4] * gradient.cy + m[5];
				var tfFX = m[0] * gradient.fx + m[1] * gradient.fy + m[2];
				var tfFY = m[3] * gradient.fx + m[4] * gradient.fy + m[5];

				gradient.cx = tfCX;
				gradient.cy = tfCY;
				gradient.fx = tfFX;
				gradient.fy = tfFY;
				// gradient.r = 10;
			}
		}

		var stops = gradientElement.querySelectorAll('stop');
		for (var k = 0, stopLength = stops.length; k < stopLength; k += 1)
		{
			var currStop = stops[k];
			var offset = Number(currStop.getAttribute('offset'));
			var color = currStop.getAttribute('stop-color') || /stop-color:(#[0-9A-F]+)/im.exec(currStop.getAttribute('style'))[1];
			var opacity = currStop.getAttribute('stop-opacity');
			gradient.stops.push({ offset: offset, color: color, opacity: opacity });
		}

		return gradient;
	}
};

SVGParser.prototype.parseCircle = function ($rawCircle)
{
	var xPos = this.getCoord($rawCircle.getAttribute('cx') || 0);
	var yPos = this.getCoord($rawCircle.getAttribute('cy') || 0);
	var radiusAttrX = $rawCircle.getAttribute('r') || $rawCircle.getAttribute('rx');
	var radiusAttrY = $rawCircle.getAttribute('ry');
	var radiusX = this.getCoord(radiusAttrX);
	var radiusY = this.getCoord(radiusAttrY) || radiusX;
	var rotation = this.getRotation($rawCircle.getAttribute('transform'));
	var pointCommands = [{ command: radiusY !== radiusX ? ELLIPSE : ARC, point: [xPos, yPos], options: [radiusX, radiusY, rotation] }];
	return { type: 'ellipse', pointCommands: pointCommands, radiusX: radiusX, radiusY: radiusY, closePath: false };
};

SVGParser.prototype.parseLine = function ($rawLine)
{
	var x1 = this.getCoord($rawLine.getAttribute('x1'));
	var x2 = this.getCoord($rawLine.getAttribute('x2'));
	var y1 = this.getCoord($rawLine.getAttribute('y1'));
	var y2 = this.getCoord($rawLine.getAttribute('y2'));
	var pointCommands = [];
	pointCommands.push({ command: MOVE_TO, point: [x1, y1], options: [] });
	pointCommands.push({ command: LINE_TO, point: [x2, y2], options: [] });
	return { type: 'line', pointCommands: pointCommands, closePath: false };
};

SVGParser.prototype.parseRect = function ($rawRect)
{
	var x1 = $rawRect.getAttribute('x') ? this.getCoord($rawRect.getAttribute('x')) : 0;
	var y1 = $rawRect.getAttribute('y') ? this.getCoord($rawRect.getAttribute('y')) : 0;
	var x2 = x1 + this.getCoord($rawRect.getAttribute('width'));
	var y2 = y1 + this.getCoord($rawRect.getAttribute('height'));

	var points =
	[
		[x1, y1],
		[x1, y2],
		[x2, y2],
		[x2, y1]
	];

	var m = this.getMatrix($rawRect.getAttribute('transform'));
	if (m)
	{
		points =
		[
			this.multiplyPointByMatrix(points[0], m),
			this.multiplyPointByMatrix(points[1], m),
			this.multiplyPointByMatrix(points[2], m),
			this.multiplyPointByMatrix(points[3], m)
			// [m[0] * x1 + m[1] * y1 + m[2], m[3] * x1 + m[4] * y1 + m[5]],
			// [m[0] * x1 + m[1] * y2 + m[2], m[3] * x1 + m[4] * y2 + m[5]],
			// [m[0] * x2 + m[1] * y2 + m[2], m[3] * x2 + m[4] * y2 + m[5]],
			// [m[0] * x2 + m[1] * y1 + m[2], m[3] * x2 + m[4] * y1 + m[5]]
		];
	}

	var pointCommands = [];
	pointCommands.push({ command: MOVE_TO, point: points[0], options: [] });
	pointCommands.push({ command: LINE_TO, point: points[1], options: [] });
	pointCommands.push({ command: LINE_TO, point: points[2], options: [] });
	pointCommands.push({ command: LINE_TO, point: points[3], options: [] });

	return { type: 'polygon', pointCommands: pointCommands, closePath: true };
};

SVGParser.prototype.parsePoly = function ($rawPoly)
{
	var regex = /([\-.\d]+)[, ]([\-.\d]+)/ig;
	var result = regex.exec($rawPoly.getAttribute('points'));
	var pointCommands = [];

	while (result)
	{
		var command = pointCommands.length === 0 ? MOVE_TO : LINE_TO;
		var point = [this.getCoord(result[1]), this.getCoord(result[2])];
		pointCommands.push({ command: command, point: point, options: [] });
		result = regex.exec($rawPoly.getAttribute('points'));
	}
	return { type: $rawPoly.tagName, pointCommands: pointCommands, closePath: $rawPoly.tagName !== 'polyline' };

	// var splits = $rawPoly.getAttribute('points').split(' ');
	// var pointCommands = {};

	// for (var i = 0, splitsLength = splits.length; i < splitsLength; i += 1)
	// {
	// 	var currSplit = splits[i];

	// 	if (currSplit !== '')
	// 	{
	// 		var point = currSplit.split(',');
	// 		var pointX = this.getCoord(point[0]);
	// 		var pointY = this.getCoord(point[1]);
	// 		var exists = false;
	// 		for (var k = 0, otherCoordsArrayLength = points.length; k < otherCoordsArrayLength; k += 1)
	// 		{
	// 			var otherPoint = points[k];
	// 			var otherX = otherPoint[0];
	// 			var otherY = otherPoint[1];
	// 			if (otherX === pointX && otherY === pointY)
	// 			{
	// 				exists = true;
	// 			}
	// 		}
	// 		if (exists === false)
	// 		{
	// 			points.push([pointX, pointY]);
	// 		}
	// 	}
	//}

	// var thickness = this.getCoord($rawPoly.getAttribute('stroke-width'));
	// var type = $rawPoly.tagName === 'polyline' ? 'polyline' : 'polygon';
	// return { type: type, pointCommands: points, thickness: thickness };
};

SVGParser.prototype.parsePath = function ($rawPath)
{
	var d = $rawPath.getAttribute('d');
	var pathReg = /([a-y])([.\-,\d]+)/igm;
	var result;
	var closePath = /z/igm.test(d);
	var coordsRegex = /-?[\d.]+/igm;
	var pointCommands = [];
	var lastX = this.getCoord(0);
	var lastY = this.getCoord(0);

	var that = this;
	var getPoint = function ($x, $y, $relative)
	{
		var x = $x === undefined ? lastX : that.getCoord($x);
		var y = $y === undefined ? lastY : that.getCoord($y);
		if ($relative)
		{
			x = lastX + x;
			y = lastY + y;
		}
		return [x, y];
	};

	var getRelativePoint = function ($point, $x, $y, $relative)
	{
		var x = that.getCoord($x);
		var y = that.getCoord($y);
		if ($relative)
		{
			x = lastX + x;
			y = lastY + y;
		}
		x = x - $point[0];
		y = y - $point[1];
		return [x, y];
	};

	var createPoint = function ($command, $point, $options)
	{
		var info = { command: $command, point: $point, options: $options || [] };
		lastX = info.point[0];
		lastY = info.point[1];
		pointCommands.push(info);
	};

	var point;
	var cubic1;
	var cubic2;
	var quadra1;

	do
	{
		result = pathReg.exec(d);
		if (result === null)
		{
			break;
		}
		var instruction = result[1].toLowerCase();
		var coords = result[2].match(coordsRegex);
		var isLowserCase = /[a-z]/.test(result[1]);

		switch (instruction)
		{
			default:
			case 'm':
				quadra1 = null;
				cubic2 = null;
				point = getPoint(coords[0], coords[1], isLowserCase);
				createPoint(MOVE_TO, point);
				break;
			case 'l':
				quadra1 = null;
				cubic2 = null;
				point = getPoint(coords[0], coords[1], isLowserCase);
				createPoint(LINE_TO, point);
				break;
			case 'v':
				quadra1 = null;
				cubic2 = null;
				point = getPoint(undefined, coords[0], isLowserCase);
				createPoint(LINE_TO, point);
				break;
			case 'h':
				quadra1 = null;
				cubic2 = null;
				point = getPoint(coords[0], undefined, isLowserCase);
				createPoint(LINE_TO, point);
				break;
			case 'c':
				quadra1 = null;
				point = getPoint(coords[4], coords[5], isLowserCase);
				cubic1 = getRelativePoint(point, coords[0], coords[1], isLowserCase);
				cubic2 = getRelativePoint(point, coords[2], coords[3], isLowserCase);
				createPoint(BEZIER_TO, point, [cubic1, cubic2]);
				break;
			case 's':
				quadra1 = null;
				point = getPoint(coords[2], coords[3], isLowserCase);
				cubic1 = cubic2 ? [lastX - cubic2[0] - point[0], lastY - cubic2[1] - point[1]] : undefined;
				cubic2 = getRelativePoint(point, coords[0], coords[1], isLowserCase);
				cubic1 = cubic1 || [cubic2[0], cubic2[1]];
				createPoint(BEZIER_TO, point, [cubic1, cubic2]);
				break;
			case 'q':
				cubic2 = null;
				point = getPoint(coords[2], coords[3], isLowserCase);
				quadra1 = getRelativePoint(point, coords[0], coords[1], isLowserCase);
				createPoint(QUADRA_TO, point, [quadra1]);
				break;
			case 't':
				cubic2 = null;
				quadra1 = quadra1 ? quadra1 : point;
				point = getPoint(coords[0], coords[1], isLowserCase);
				createPoint(QUADRA_TO, point, [quadra1]);
				break;
			case 'a':
				cubic2 = null;
				quadra1 = null;
				point = getPoint(coords[5], coords[6], isLowserCase);
				createPoint('arcTo', point);
				console.warn('not supported');
				break;
		}
	}
	while (result);

	return { type: 'path', pointCommands: pointCommands, closePath: closePath };
	//var points =
	// var pathReg = /([mlscvh])(-?[\d\.]*[,-]+[\d\.]*),?(-?[\d\.]*,?-?[\d\.]*),?(-?[\d\.]*,?-?[\d\.]*)/igm;
	// var points = [];
	// var lastCoordX = this.getCoord(0);
	// var lastCoordY = this.getCoord(0);
	// console.log(pathReg.exec(d));
	// debugger;
	// for (var array = pathReg.exec(d); array !== null; array = pathReg.exec(d))
	// {
	// 	var coordString;
	// 	var numberCoordX;
	// 	var numberCoordY;
	// 	if (array[1] === 'v')
	// 	{
	// 		numberCoordX = lastCoordX;
	// 		numberCoordY = lastCoordY + this.getCoord(array[2]);
	// 	}
	// 	else if (array[1] === 'h')
	// 	{
	// 		numberCoordX = lastCoordX + this.getCoord(array[2]);
	// 		numberCoordY = lastCoordY;
	// 	}
	// 	else
	// 	{
	// 		if (array[4] !== '')
	// 		{
	// 			coordString = array[4];
	// 		}
	// 		else if (array[3] !== '')
	// 		{
	// 			coordString = array[3];
	// 		}
	// 		else
	// 		{
	// 			coordString = array[2];
	// 		}
	// 		var coordReg = /(-?\d+\.?\d*)/igm;
	// 		var coords = coordString.match(coordReg);

	// 		numberCoordX = lastCoordX + this.getCoord(coords[0]);
	// 		numberCoordY = lastCoordY + this.getCoord(coords[1]);
	// 	}
	// 	//console.log(numberCoordX, numberCoordY);
	// 	points.push([numberCoordX, numberCoordY]);

	// 	lastCoordX = numberCoordX;
	// 	lastCoordY = numberCoordY;
	// }
	// console.log(points);
	// debugger;

	// var thickness = this.getCoord($rawPath.getAttribute('stroke-width'));
	// return { type: 'path', points: points, thickness: thickness };
};

SVGParser.prototype.round = function ($number)
{
	// var number = Number($number);
	// return Math.floor(number * 100) / 100;
	return $number;
	//return Math.floor(Number($number));
};

SVGParser.prototype.getMatrix = function ($attribute)
{
	if (!$attribute) { return null; }

	var TFType = $attribute.match(/([a-z]+)/igm)[0];
	var values = $attribute.match(/(-?[\d.]+)/igm);

	var matrices = [];
	var tX;
	var tY;
	var angle;

	if (TFType === 'matrix')
	{
		return [Number(values[0]), Number(values[2]), this.getCoord(values[4]), Number(values[1]), Number(values[3]), this.getCoord(values[5]), 0, 0, 1];
	}
	else if (TFType === 'rotate')
	{
		angle = Number(values[0]) * (Math.PI / 180);
		tX = this.getCoord(Number(values[1] || 0));
		tY = this.getCoord(Number(values[2] || 0));
		var m1 = [1, 0, tX, 0, 1, tY, 0, 0, 1];
		var m2 = [Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 1];
		var m3 = [1, 0, -tX, 0, 1, -tY, 0, 0, 1];

		matrices.push(m1, m2, m3);
		var p = m1;

		for (var i = 1, matricesLength = matrices.length; i < matricesLength; i += 1)
		{
			var currMat = matrices[i];
			var newP = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			for (var k = 0; k < 9; k += 1)
			{
				var row = Math.floor(k / 3);
				var col = k % 3;
				//var mVal = p[row * col - 1];
				for (var pos = 0; pos < 3; pos += 1)
				{
					newP[k] = newP[k] + p[row * 3 + pos] * currMat[pos * 3 + col];
				}
			}
			p = newP;
		}
		return p;
	}
	else if (TFType === 'translate')
	{
		tX = this.getCoord(Number(values[0] || 0));
		tY = this.getCoord(Number(values[1] || 0));
		return [1, 0, tX, 0, 1, tY, 0, 0, 1];
	}
	else if (TFType === 'scale')
	{
		var sX = this.getCoord(Number(values[0] || 0));
		var sY = this.getCoord(Number(values[1] || 0));
		return [sX, 0, 0, 0, sY, 0];
	}
	else if (TFType === 'skewX')
	{
		angle = Number(values[0]) * (Math.PI / 180);
		return [1, Math.tan(angle), 0, 0, 1, 0, 0, 0, 1];
	}
	else if (TFType === 'skewY')
	{
		angle = Number(values[0]) * (Math.PI / 180);
		return [1, 0, 0, Math.tan(angle), 1, 0, 0, 0, 1];
	}
};

SVGParser.prototype.multiplyPointByMatrix = function ($point, m)
{
	var h = [$point[0], $point[1], 1];
	var p =
	[
		m[0] * h[0] + m[1] * h[1] + m[2] * h[2],
		m[3] * h[0] + m[4] * h[1] + m[5] * h[2],
		m[6] * h[0] + m[7] * h[1] + m[8] * h[2]
	];
	return [p[0] / p[2], p[1] / p[2]];
};

SVGParser.prototype.getRotation = function ($attribute)
{
	var matrix = this.getMatrix($attribute);
	if (matrix)
	{
		return Math.atan2(matrix[0], matrix[3]);
	}
	return 0;
};

SVGParser.prototype.getCoord = function ($coordSTR)
{
	var number = this.round($coordSTR);
	return number * this.ratio;
};

SVGParser.prototype.parseCustomJoints = function ($rawGroup, $group)
{
	var children = $rawGroup.childNodes;//$rawGroup.querySelectorAll('[id*="constraint"]');

	for (var i = 0, childrenLength = children.length; i < childrenLength; i += 1)
	{
		if (children[i].nodeType === Node.TEXT_NODE || children[i].id.search(/joint/i) < 0) { continue; }

		var currRawJoint = children[i];
		var p1x = this.getCoord(currRawJoint.getAttribute('x1'));
		var p1y = this.getCoord(currRawJoint.getAttribute('y1'));
		var p2x = this.getCoord(currRawJoint.getAttribute('x2'));
		var p2y = this.getCoord(currRawJoint.getAttribute('y2'));

		var n1 = $group.getNodeAtPoint(p1x, p1y) || $group.createNode(p1x, p1y);
		var n2 = $group.getNodeAtPoint(p2x, p2y) || $group.createNode(p2x, p2y);
		$group.createJoint(n1, n2);
	}
};

module.exports = SVGParser;

