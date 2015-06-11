var SVJellyWorld = require('./core/SVJellyWorld');
var SVJellyRenderer = require('./renderer/svjelly/SVJellyRenderer');
var SVGParser = require('./core/SVGParser');
var P2PhysicsManager = require('./physics/p2physics/P2PhysicsManager');
var SVJellyUtils = require('./core/SVJellyUtils');
var confObject = require('./core/ConfObject');

//TODO promise polyfill
var SVJellyMaker =
{
	createFromURL: function ($canvas, $URL, $physicsManager, $renderer)
	{
		var svjellyMaker = Object.create(SVJellyMaker);
		svjellyMaker.canvas = $canvas;
		svjellyMaker.renderer = $renderer;
		svjellyMaker.physicsManager = $physicsManager;
		svjellyMaker.loadFile($URL, function ($SVG) { svjellyMaker.create($SVG); }, true);
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
					svjellyMaker.create($SVG);
					resolve();
				}, true);
			};
			SVJellyMaker.loadFile($configURL, loadConfigComplete);
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
				svjellyMaker.create(wrapper);
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
	create: function ($SVG)
	{
		var requestAnimFrame = window.requestAnimationFrame ||
								window.webkitRequestAnimationFrame ||
								window.mozRequestAnimationFrame;

		var cancelAnimFrame = window.cancelAnimationFrame ||
								window.webkitCancelAnimationFrame ||
								window.mozCancelAnimationFrame;

		var conf = this.conf || confObject;
		var canvas = this.canvas;

		this.physicsManager = this.physicsManager || new P2PhysicsManager(conf);
		var svjellyWorld = this.svjellyWorld = new SVJellyWorld(this.physicsManager, conf);

		var requestID = '';

		var canvasDefinition = conf.definition;
		var svgDef = $SVG.querySelector('svg');
		var parser = new SVGParser();
		parser.parse(svjellyWorld, svgDef);
		var canvasWidth = canvas.clientWidth * canvasDefinition;
		var canvasHeight = canvas.clientWidth * (parser.viewBoxHeight / parser.viewBoxWidth) * canvasDefinition;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.transformOrigin = '0 0';
		canvas.style.transform = 'scale(' + 1 / canvasDefinition + ')';

		var Renderer = this.renderer || SVJellyRenderer;
		var svjellyDraw = new Renderer(svjellyWorld, canvas);

		var lastSim = window.performance.now();
		var lastRender = window.performance.now();
		var simDiff;
		var diffRender;
		var simTargetFPSMilliSeconds = 16;//$configData.simRenderFreq; //60fps
		var renderTargetFPSMilliSeconds = 0;

		var update = function ($now)
		{
			simDiff = $now - lastSim;
			diffRender = $now - lastRender;
			if (simDiff >= simTargetFPSMilliSeconds)
			{
				svjellyWorld.physicsManager.step(Math.min(1, simDiff / 1000));
				lastSim = $now;
			}
			if (diffRender >= renderTargetFPSMilliSeconds)
			{
				svjellyDraw.draw();
				lastRender = $now;
			}
			requestID = requestAnimFrame(update);
		};

		window.addEventListener('focus', function () { requestID = requestAnimFrame(update); });
		window.addEventListener('blur', function () { cancelAnimFrame(requestID); });

		requestID = requestAnimFrame(update);
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
