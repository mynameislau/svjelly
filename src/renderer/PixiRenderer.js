/****************
Work in progress, poor performances
****************/

var Pixi = require('./pixi');

var PixiRenderer = function ($world, $mainContainer, $scale)
{
	this.world = $world;
	this.debug = true;

	this.drawScaleX = this.drawScaleY = $scale;

	this.graphics = new Pixi.Graphics();
	$mainContainer.addChild(this.graphics);
};

PixiRenderer.prototype.draw = function ()
{
	this.graphics.clear();
	// set a fill and line style
	this.graphics.beginFill(0xFF3300);
	this.graphics.lineStyle(10, 0xffd900, 1);

	// draw a shape
	this.graphics.moveTo(50, 50);
	this.graphics.lineTo(250, 50);
	this.graphics.endFill();

	// var strokeStyle;
	// var fillStyle;

	for (var k = 0, groupsLength = this.world.groups.length; k < groupsLength; k += 1)
	{
		var currGroup = this.world.groups[k];
		// console.log('new group.', 'group nodes :', currGroup.nodesArray.length);

		/*for (var i = 0, nodesLength = currGroup.nodesArray.length; i < nodesLength; i += 1)
		{
			var curr = currGroup.nodesArray[i];
			// if (i === 0) { console.log(curr.getY()); }
			// console.log('new node.', 'is start :', curr.drawing.isStart, 'stroke : ', curr.drawing.stroke);
			if ((curr.drawing.stroke !== undefined && curr.drawing.stroke !== strokeStyle) ||
				(curr.drawing.fill !== undefined && curr.drawing.fill !== fillStyle))
			{
				if (fillStyle) { this.context.fill(); }
				if (strokeStyle) { this.context.stroke(); }

				if (curr.drawing.strokeGradient)
				{
					var x1 = curr.getX() * this.drawScaleX;
					var y1 = curr.getY() * this.drawScaleY;
					var x2 = curr.drawing.endNode.getX() * this.drawScaleX;
					var y2 = curr.drawing.endNode.getY() * this.drawScaleY;
					var gradient = this.context.createLinearGradient(x1, y1, x2, y2);
					for (var stopN = 0, stopLength = curr.drawing.strokeGradient.length; stopN < stopLength; stopN += 1)
					{
						gradient.addColorStop(1 - curr.drawing.strokeGradient[stopN].offset, curr.drawing.strokeGradient[stopN].color);
					}
					this.context.strokeStyle = gradient;
				}
				else
				{
					this.context.strokeStyle = curr.drawing.stroke;
				}
				//this.context.strokeStyle = strokeStyle = curr.drawing.stroke;
				//this.context.strokeStyle = strokeStyle = gradient;//curr.drawing.stroke;
				strokeStyle = curr.drawing.stroke;
				this.context.fillStyle = fillStyle = curr.drawing.fill;
				this.context.lineCap = 'round';
				this.context.lineJoin = 'round';
				this.context.lineWidth = curr.drawing.strokeWidth * this.drawScaleX;

				this.context.beginPath();
			}
			if (curr.drawing.isStart)
			{
				this.context.moveTo(curr.getX() * this.drawScaleX, curr.getY() * this.drawScaleY);
			}
			else
			{
				this.context.lineTo(curr.getX() * this.drawScaleX, curr.getY() * this.drawScaleY);
			}
		}

		if (currGroup.type !== 'line') { this.context.closePath(); }
		if (fillStyle) { this.context.fill(); }
		if (strokeStyle) { this.context.stroke(); }*/

		if (this.debug)
		{
			var nodesLength = currGroup.nodesArray.length;

			//this.context.clearRect(0, 0, this.width, this.height);

			this.graphics.lineStyle(2, 0xFF00FF, 1);
			// this.context.beginPath();

			var jointsLength = currGroup.jointsArray.length;
			for (var i = 0; i < jointsLength; i += 1)
			{
				var currJoint = currGroup.jointsArray[i];
				this.graphics.moveTo(currJoint.node1.getX() * this.drawScaleX, currJoint.node1.getY() * this.drawScaleY);
				this.graphics.lineTo(currJoint.node2.getX() * this.drawScaleX, currJoint.node2.getY() * this.drawScaleY);
			}

			//this.context.stroke();

			this.graphics.lineStyle(2, 0x00FF00, 1);
			for (i = 0; i < nodesLength; i += 1)
			{
				var currNode = currGroup.nodesArray[i];
				this.graphics.drawCircle(currNode.getX() * this.drawScaleX, currNode.getY() * this.drawScaleY, currGroup.physicsManager.nodesDiameter * this.drawScaleX);
			}
		}
	}

	//console.log(strokeStyle, fillStyle);
};

module.exports = PixiRenderer;

