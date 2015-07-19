var SVJellyWorld = require('./core/SVJellyWorld');
var SVJellyRenderer = require('./renderer/svjelly/SVJellyRenderer');
var SVGParser = require('./core/SVGParser');
var P2PhysicsManager = require('./physics/p2physics/P2PhysicsManager');
var P2MouseControls = require('./physics/p2physics/P2MouseControls');
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
	create: function ()
	{
		var svjellyMaker = Object.create(SVJellyMaker);
		svjellyMaker.initiated = new window.Promise(function (resolve) { svjellyMaker.initiatedResolve = resolve; });
		return svjellyMaker;
	},

	createFromURL: function ($container, $URL, $width, $height, $scaleMode)
	{
		var svjellyMaker = SVJellyMaker.create();
		svjellyMaker.loadFile($URL, function ($SVG)
		{
			svjellyMaker.init($container, $SVG, $width, $height, $scaleMode);
		}, true);
		return svjellyMaker;
	},
	createFromConfig: function ($container, $configURL, $width, $height, $scaleMode)
	{
		var svjellyMaker = SVJellyMaker.create();
		var loadConfigComplete = function ($configData)
		{
			var JSONConfig = JSON.parse($configData);
			svjellyMaker.conf = SVJellyUtils.extend(confObject, JSONConfig);

			SVJellyMaker.loadFile(svjellyMaker.conf.source, function ($SVG)
			{
				svjellyMaker.init($container, $SVG, $width, $height, $scaleMode);
			}, true);
		};
		SVJellyMaker.loadFile($configURL, loadConfigComplete);

		return svjellyMaker;
	},
	createFromString: function ($container, $string, $width, $height, $scaleMode)
	{
		var parser = new DOMParser();
		var doc = parser.parseFromString($string, 'image/svg+xml');
		var svjellyMaker = SVJellyMaker.create();
		svjellyMaker.init($container, doc, $width, $height, $scaleMode);
		return svjellyMaker;
	},
	createFromPageSVG: function ()
	{
		var svjellies = document.querySelectorAll('[data-svjelly]');

		var createViewer = function ($element)
		{
			var svjellyMaker = SVJellyMaker.create();
			var currSVG = $element;
			var appendCanvas = function ($config)
			{
				svjellyMaker.conf = $config;
				var container;
				if (svjellyMaker.conf.multiCanvas)
				{
					container = document.createElement('div');
					container.style.width = currSVG.clientWidth + 'px';
					container.style.height = currSVG.clientHeight + 'px';
				}
				else
				{
					container = document.createElement('canvas');
					container.width = currSVG.clientWidth;
					container.height = currSVG.clientHeight;
				}

				currSVG.parentElement.insertBefore(container, currSVG);
				currSVG.remove();
				svjellyMaker.container = container;
				var wrapper = document.createElement('div');
				wrapper.appendChild(currSVG);
				svjellyMaker.init(container, wrapper, container.clientWidth, container.clientHeight);
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

	init: function ($container, $SVG, $width, $height, $scaleMode)
	{
		var conf = this.conf || confObject;
		this.container = $container;

		this.physicsManager = this.physicsManager || new P2PhysicsManager(conf);
		var svjellyWorld = this.svjellyWorld = new SVJellyWorld(this.physicsManager, conf);

		var canvasDefinition = conf.definition || 1;
		var svgDef = $SVG.querySelector('svg');
		var parser = new SVGParser();
		parser.parse(svjellyWorld, svgDef);

		var width = $width || this.container.clientWidth;
		var height = $height || this.container.clientHeight;

		var ratioCanvas = height / width;
		var ratioSVG = parser.viewBoxHeight / parser.viewBoxWidth;
		var canvasWidth;
		var canvasHeight;

		if ((ratioSVG < ratioCanvas && $scaleMode !== 'max') || (ratioSVG > ratioCanvas && $scaleMode === 'max'))
		{
			canvasWidth = width * canvasDefinition;
			canvasHeight = canvasWidth * ratioSVG;
		}
		else
		{
			canvasHeight = height * canvasDefinition;
			canvasWidth = canvasHeight / ratioSVG;
		}

		// this.container.width = canvasWidth;
		// this.container.height = canvasHeight;

		this.renderer = this.Renderer ? this.Renderer.create(svjellyWorld, this.container) : SVJellyRenderer.create(svjellyWorld, this.container);
		this.renderer.setSize(canvasWidth, canvasHeight);

		if (canvasDefinition !== 1)
		{
			this.container.style.transformOrigin = '0 0';
			this.container.style.transform = 'scale(' + 1 / canvasDefinition + ')';
		}

		var requestID = '';
		var lastRender = window.performance.now();
		var diffRender;
		var renderTargetFPS = 0;
		var self = this;

		var update = function ($now)
		{
			if (self.updateCallback) { self.updateCallback($now); }

			diffRender = $now - lastRender;

			self.svjellyWorld.physicsManager.step($now);
			if (diffRender >= renderTargetFPS)
			{
				self.renderer.draw();
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

		this.initiatedResolve();
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

	addBasicMouseControls: function ($stiffness, $relaxation)
	{
		var world = this.svjellyWorld;
		var p2World = world.physicsManager.p2World;
		if (this.mouseControls) { this.mouseControls.removeBasicMouseControls(); }
		this.mouseControls = new P2MouseControls(world, p2World, this.renderer);
		this.mouseControls.addBasicMouseControls($stiffness, $relaxation);
	},

	removeBasicMouseControls: function ()
	{
		this.mouseControls.removeBasicMouseControls();
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
