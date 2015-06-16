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
	createFromURL: function ($canvas, $URL, $physicsManager, $renderer)
	{
		var svjellyMaker = Object.create(SVJellyMaker);
		svjellyMaker.canvas = $canvas;
		svjellyMaker.renderer = $renderer;
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
	createFromConfig: function ($canvas, $configURL, $physicsManager, $renderer)
	{
		var svjellyMaker = Object.create(SVJellyMaker);
		svjellyMaker.canvas = $canvas;
		svjellyMaker.renderer = $renderer;
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
	createFromPageSVG: function ($physicsManager, $renderer)
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
				svjellyMaker.renderer = $renderer;
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

		var Renderer = this.renderer || SVJellyRenderer;
		this.svjellyDraw = new Renderer(svjellyWorld, this.canvas);

		var requestID = '';
		var lastSim = window.performance.now();
		var lastRender = window.performance.now();
		var simDiff;
		var diffRender;
		var simTargetFPS = 1 / 60 * 1000;//$configData.simRenderFreq; //60fps
		var simMinimumFPS = 1 / 12 * 1000;
		var renderTargetFPS = 0;
		var that = this;

		var update = function ($now)
		{
			if (that.updateCallback) { that.updateCallback($now); }

			simDiff = $now - lastSim;
			diffRender = $now - lastRender;
			if (simDiff >= simTargetFPS)
			{
				that.svjellyWorld.physicsManager.step(Math.min(simMinimumFPS / 1000, simDiff / 1000));
				lastSim = $now;
			}
			if (diffRender >= renderTargetFPS)
			{
				that.svjellyDraw.draw();
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

	setBasicMouseControls: function ()
	{
		var world = this.svjellyWorld;
		var p2 = world.physicsManager.p2;
		var p2World = world.physicsManager.p2World;

		//MOUSE
		var mouseBody = new p2.Body();
		p2World.addBody(mouseBody);

		var mouseConstraint;
		var bodies = p2World.bodies.concat();
		var body;
		var scale = this.canvas.width / world.getWidth();

		var getPhysicsCoord = function (mouseEvent)
		{
			var rect = this.canvas.getBoundingClientRect();
			var x = mouseEvent.clientX - rect.left;
			var y = mouseEvent.clientY - rect.top;

			x = x / scale;
			y = (this.canvas.height - y) / scale;
			return [x, y];
		};

		var canvas = this.canvas;
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
			var hitBodies = p2World.hitTest(position, bodies, 1000);

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
				canvas.addEventListener('mousemove', mouseMove);
			}
		};

		var mouseUp = function ()
		{
			p2World.removeConstraint(mouseConstraint);
			mouseConstraint = null;
			canvas.removeEventListener('mousemove', mouseMove);
		};

		canvas.addEventListener('mousedown', mouseDown);
		// Remove the mouse constraint on mouse up
		canvas.addEventListener('mouseup', mouseUp);

		this.removeBasicMouseControls = function ()
		{
			canvas.removeEventListener('mousemove', mouseMove);
			canvas.removeEventListener('mousedown', mouseDown);
			canvas.removeEventListener('mouseup', mouseUp);
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
