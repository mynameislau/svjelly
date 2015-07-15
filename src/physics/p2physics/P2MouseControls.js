var p2 = require('../../../libs/p2');

var P2MouseControls = function ($world, $p2World, $renderer)
{
	this.renderer = $renderer;
	this.world = $world;
	this.p2World = $p2World;
	this.touchConstraints = {};
};

P2MouseControls.prototype.addBasicMouseControls = function ($stiffness, $relaxation)
{
	var p2World = this.p2World;
	var renderer = this.renderer;
	var container = this.renderer.container;
	var touchConstraints = this.touchConstraints;

	//prevent default scrolling
	document.body.addEventListener('touchmove', function (event) {
		event.preventDefault();
	}, false);

	var worldWidth = this.world.worldWidth;
	var worldHeight = this.world.physicsManager.worldHeight;
	//var bodies = this.p2World.bodies.concat();
	var groups = this.world.groups;

	var getPhysicsCoord = function ($contact)
	{
		var trgt = event.target;
		var pos = trgt.getBoundingClientRect();

		var x = ($contact.clientX - pos.left) / (pos.right - pos.left);
		var y = ($contact.clientY - pos.top) / (pos.bottom - pos.top);
		x = renderer.viewCenter[0] + (x - 0.5) * renderer.viewWidth;
		y = renderer.viewCenter[1] + (y - 0.5) * renderer.viewHeight;

		return [x, y];
	};

	var constrain = function ($contact, $identifier)
	{
		var body;
		var position = getPhysicsCoord($contact);
		for (var i = 0, length = groups.length; i < length; i += 1)
		{
			var currGroup = groups[i];
			if (currGroup.physicsManager.hitTest)
			{
				body = currGroup.physicsManager.hitTest(position, worldWidth / 50);
				if (body) { break; }
			}
		}

		if (body)
		{
			var touchBody = new p2.Body();
			p2World.addBody(touchBody);

			touchBody.position[0] = position[0];
			touchBody.position[1] = worldHeight - position[1];

			var touchConstraint = new p2.LockConstraint(touchBody, body,
			{
				//worldPivot: position,
				collideConnected: false
			});
			//touchConstraint.setLimits(0, 0);

			touchConstraint.setStiffness($stiffness || 200);
			touchConstraint.setRelaxation($relaxation || 1);

			p2World.addConstraint(touchConstraint);
			touchConstraints[$identifier] = touchConstraint;
		}
	};

	var touchMove = function (event)
	{
		event.preventDefault();

		var touches = event.changedTouches || [event];
		for (var i = 0, length = touches.length; i < length; i += 1)
		{
			var touch = touches[i];
			var identifier = touch.identifier || 'mouse';
			if (touchConstraints[identifier])
			{
				var position = getPhysicsCoord(touch);
				touchConstraints[identifier].bodyA.position[0] = position[0];
				touchConstraints[identifier].bodyA.position[1] = worldHeight - position[1];
			}
		}
	};

	var touchStart = function (event)
	{
		event.preventDefault();

		var touches = event.changedTouches || [event];
		for (var i = 0, length = touches.length; i < length; i += 1)
		{
			var touch = touches[i];
			var identifier = touch.identifier || 'mouse';
			if (!touchConstraints[identifier])
			{
				constrain(touch, identifier);
			}
		}
		container.addEventListener('mousemove', touchMove);
		window.addEventListener('mouseup', touchEnd);
	};

	var touchEnd = function (event)
	{
		event.preventDefault();
		var changedTouches = event.changedTouches || [event];
		for (var i = 0, length = changedTouches.length; i < length; i += 1)
		{
			var identifier = changedTouches[i].identifier || 'mouse';
			var constraint = touchConstraints[identifier];
			if (touchConstraints[identifier])
			{
				var touchBody = constraint.bodyA;
				p2World.removeConstraint(constraint);
				p2World.removeBody(touchBody);
				touchConstraints[identifier] = undefined;
			}
		}
		container.removeEventListener('mousemove', touchMove);
		window.removeEventListener('mouseup', touchEnd);
	};

	this.removeBasicMouseControls = function ()
	{
		container.removeEventListener('mousemove', touchMove);
		container.removeEventListener('mousedown', touchStart);
		window.removeEventListener('mouseup', touchEnd);
		container.removeEventListener('touchstart', touchStart);
		container.removeEventListener('touchend', touchEnd);
		container.removeEventListener('touchmove', touchMove);
	};

	container.addEventListener('mousedown', touchStart);
	container.addEventListener('touchstart', touchStart);
	container.addEventListener('touchmove', touchMove);
	container.addEventListener('touchend', touchEnd);
};

module.exports = P2MouseControls;

