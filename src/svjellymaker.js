var SVJellyWorld = require('./core/SVJellyWorld');
var SVJellyRenderer = require('./renderer/svjelly/SVJellyRenderer');
var SVGParser = require('./core/SVGParser');
var P2PhysicsManager = require('./physics/p2physics/P2PhysicsManager');
var SVJellyUtils = require('./core/SVJellyUtils');
var confObject = require('./core/ConfObject');

var requestAnimFrame = window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame;

var cancelAnimFrame = window.cancelAnimationFrame ||
						window.webkitCancelAnimationFrame ||
						window.mozCancelAnimationFrame;

//TODO promise polyfill
var SVJellyMaker =
{
	createFromURL: function ($canvas, $URL, $physicsManager, $Renderer)
	{
		var svjellyMaker = Object.create(SVJellyMaker);
		svjellyMaker.canvas = $canvas;
		svjellyMaker.Renderer = $Renderer;
		svjellyMaker.physicsManager = $physicsManager;
		svjellyMaker.promise = new window.Promise(function (resolve)
		{
			svjellyMaker.loadFile($URL, function ($SVG)
			{
				svjellyMaker.create($canvas, $SVG);
				resolve();
			}, true);
		});
		return svjellyMaker;
	},
	createFromConfig: function ($canvas, $configURL, $physicsManager, $Renderer)
	{
		var svjellyMaker = Object.create(SVJellyMaker);
		svjellyMaker.canvas = $canvas;
		svjellyMaker.Renderer = $Renderer;
		svjellyMaker.physicsManager = $physicsManager;

		svjellyMaker.promise = new window.Promise(function (resolve)
		{
			var loadConfigComplete = function ($configData)
			{
				var JSONConfig = JSON.parse($configData);
				svjellyMaker.conf = SVJellyUtils.extend(confObject, JSONConfig);

				SVJellyMaker.loadFile(svjellyMaker.conf.source, function ($SVG)
				{
					svjellyMaker.create($canvas, $SVG);
					resolve();
				}, true);
			};
			SVJellyMaker.loadFile($configURL, loadConfigComplete);
		});

		return svjellyMaker;
	},
	createFromString: function ($canvas, $string)
	{
		var parser = new DOMParser();
		var doc = parser.parseFromString($string, 'image/svg+xml');
		var svjellyMaker = Object.create(SVJellyMaker);
		svjellyMaker.promise = new window.Promise(function (resolve)
		{
			svjellyMaker.create($canvas, doc);
			resolve();
		});
		return svjellyMaker;
	},
	createFromPageSVG: function ($physicsManager, $Renderer)
	{
		var svjellies = document.querySelectorAll('[data-svjelly]');

		var createViewer = function ($element)
		{
			var svjellyMaker = Object.create(SVJellyMaker);
			var currSVG = $element;
			var appendCanvas = function ($config)
			{
				svjellyMaker.conf = $config;
				var canvas = document.createElement('canvas');
				canvas.width = currSVG.clientWidth;
				canvas.height = currSVG.clientHeight;
				currSVG.parentElement.insertBefore(canvas, currSVG);
				currSVG.remove();
				svjellyMaker.canvas = canvas;
				svjellyMaker.Renderer = $Renderer;
				svjellyMaker.physicsManager = $physicsManager;
				var wrapper = document.createElement('div');
				wrapper.appendChild(currSVG);
				svjellyMaker.create(canvas, wrapper);
			};
			var configURL = currSVG.getAttribute('data-svjelly');
			if (configURL)
			{
				SVJellyMaker.loadFile(configURL, function ($configData)
				{
					var JSONConfig = JSON.parse($configData);
					appendCanvas(SVJellyUtils.extend(confObject, JSONConfig));
				});
			}
			else
			{
				appendCanvas();
			}
		};

		for (var i = 0, length = svjellies.length; i < length; i += 1)
		{
			var currSVG = svjellies[i];
			createViewer(currSVG);
		}
	},

	create: function ($canvas, $SVG)
	{
		var conf = this.conf || confObject;
		this.canvas = $canvas;

		this.physicsManager = this.physicsManager || new P2PhysicsManager(conf);
		var svjellyWorld = this.svjellyWorld = new SVJellyWorld(this.physicsManager, conf);

		var canvasDefinition = conf.definition;
		var svgDef = $SVG.querySelector('svg');
		var parser = new SVGParser();
		parser.parse(svjellyWorld, svgDef);
		var canvasWidth = this.canvas.clientWidth * canvasDefinition;
		var canvasHeight = this.canvas.clientWidth * (parser.viewBoxHeight / parser.viewBoxWidth) * canvasDefinition;

		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;
		this.canvas.style.transformOrigin = '0 0';
		this.canvas.style.transform = 'scale(' + 1 / canvasDefinition + ')';

		this.renderer = this.Renderer ? this.Renderer.create(svjellyWorld, this.canvas) : SVJellyRenderer.create(svjellyWorld, this.canvas);

		var requestID = '';
		var lastRender = window.performance.now();
		var diffRender;
		var renderTargetFPS = 0;
		var that = this;

		var update = function ($now)
		{
			if (that.updateCallback) { that.updateCallback($now); }

			diffRender = $now - lastRender;

			that.svjellyWorld.physicsManager.step($now);
			if (diffRender >= renderTargetFPS)
			{
				that.renderer.draw();
				lastRender = $now;
			}
			requestID = requestAnimFrame(update);
		};

		var addAnimRequest = function ()
		{
			cancelAnimFrame(requestID);
			requestID = requestAnimFrame(update);
		};
		var cancelAnimRequest = function ()
		{
			cancelAnimFrame(requestID);
		};

		window.addEventListener('focus', addAnimRequest);
		window.addEventListener('blur', cancelAnimRequest);
		addAnimRequest();

		this.remove = function ()
		{
			cancelAnimRequest();
			window.removeEventListener('focus', addAnimRequest);
			window.removeEventListener('blur', cancelAnimRequest);
		};
	},

	loadFile: function ($URL, $successCallback, $XML)
	{
		var error = function ()
		{
			console.log('error', $URL);
		};

		var handler = function ()
		{
			$successCallback($XML ? this.responseXML : this.responseText);
		};

		var request = new XMLHttpRequest();
		request.addEventListener('load', handler);
		request.addEventListener('error', error);
		request.open('get', $URL, true);
		request.send();
	},

	addBasicMouseControls: function ()
	{
		var world = this.svjellyWorld;
		var p2 = world.physicsManager.p2;
		var p2World = world.physicsManager.p2World;
		var container = this.renderer.container;

		//MOUSE
		var mouseBody = new p2.Body();
		p2World.addBody(mouseBody);

		var mouseConstraint;
		var bodies = p2World.bodies.concat();
		var body;
		var scale = this.renderer.scaleX;
		var renderer = this.renderer;

		var getPhysicsCoord = function (mouseEvent)
		{
			var x = mouseEvent.clientX - container.offsetLeft;
			var y = mouseEvent.clientY - container.offsetTop;

			x = x / scale;
			// console.log(container.offsetLeft, container.offsetTop, mouseEvent.clientX, mouseEvent.clientY, scale);
			console.log(container.clientHeight);
			y = (renderer.height - y) / scale;
			return [x, y];
		};

		var mouseMove = function (event)
		{
			var position = getPhysicsCoord(event);
			mouseBody.position[0] = position[0];
			mouseBody.position[1] = position[1];
		};

		var mouseDown = function (event)
		{
			var position = getPhysicsCoord(event);

			// Check if the cursor is inside the box
			var hitBodies = p2World.hitTest(position, bodies);

			if (hitBodies.length)
			{
				body = hitBodies[0];
				// Move the mouse body to the cursor position

				mouseBody.position[0] = position[0];
				mouseBody.position[1] = position[1];

				// Create a RevoluteConstraint.
				// This constraint lets the bodies rotate around a common point
				mouseConstraint = new p2.RevoluteConstraint(mouseBody, body,
				{
					worldPivot: position,
					collideConnected: false
				});
				p2World.addConstraint(mouseConstraint);
				container.addEventListener('mousemove', mouseMove);
			}
		};

		var mouseUp = function ()
		{
			p2World.removeConstraint(mouseConstraint);
			mouseConstraint = null;
			container.removeEventListener('mousemove', mouseMove);
		};

		container.addEventListener('mousedown', mouseDown);
		// Remove the mouse constraint on mouse up
		container.addEventListener('mouseup', mouseUp);

		this.removeBasicMouseControls = function ()
		{
			container.removeEventListener('mousemove', mouseMove);
			container.removeEventListener('mousedown', mouseDown);
			container.removeEventListener('mouseup', mouseUp);
		};
	}
};

if (document.querySelector('[data-svjelly-auto]'))
{
	var windowLoadHandler = function ()
	{
		SVJellyMaker.createFromPageSVG();
	};
	window.addEventListener('load', windowLoadHandler);
}

module.exports = SVJellyMaker;
