var SVJellyWorld = require('./core/SVJellyWorld');
var SVJellyRenderer = require('./renderer/svjelly/SVJellyRenderer');
var SVGParser = require('./core/SVGParser');
var P2PhysicsManager = require('./physics/p2physics/P2PhysicsManager');
var SVJellyUtils = require('./core/SVJellyUtils');
var confObject = require('./core/ConfObject');

var svjellyMaker =
{
	createFromURL: function ($canvas, $URL, $physicsManager, $renderer)
	{
		var sceneViewer = Object.create(svjellyMaker);
		sceneViewer.canvas = $canvas;
		sceneViewer.renderer = $renderer;
		sceneViewer.physicsManager = $physicsManager;
		sceneViewer.loadFile($URL, function ($SVG) { sceneViewer.create($SVG); }, true);
		return sceneViewer;
	},
	createFromConf: function ($canvas, $configURL, $physicsManager, $renderer)
	{
		var sceneViewer = Object.create(svjellyMaker);
		sceneViewer.canvas = $canvas;
		sceneViewer.renderer = $renderer;
		sceneViewer.physicsManager = $physicsManager;
		var loadConfigComplete = function ($configData)
		{
			var JSONConfig = JSON.parse($configData);
			sceneViewer.conf = SVJellyUtils.extend(confObject, JSONConfig);

			svjellyMaker.loadFile(sceneViewer.conf.source, function ($SVG) { sceneViewer.create($SVG); }, true);
		};
		svjellyMaker.loadFile($configURL, loadConfigComplete);
		return sceneViewer;
	},
	createFromPageSVG: function ($physicsManager, $renderer)
	{
		var svjellies = document.querySelectorAll('[data-svjelly]');

		var createViewer = function ($element)
		{
			var sceneViewer = Object.create(svjellyMaker);
			var currSVG = $element;
			var appendCanvas = function ($config)
			{
				sceneViewer.conf = $config;
				var canvas = document.createElement('canvas');
				canvas.width = currSVG.clientWidth;
				canvas.height = currSVG.clientHeight;
				currSVG.parentElement.insertBefore(canvas, currSVG);
				currSVG.remove();
				sceneViewer.canvas = canvas;
				sceneViewer.renderer = $renderer;
				sceneViewer.physicsManager = $physicsManager;
				var wrapper = document.createElement('div');
				wrapper.appendChild(currSVG);
				sceneViewer.create(wrapper);
			};
			var configURL = currSVG.getAttribute('data-svjelly');
			if (configURL)
			{
				svjellyMaker.loadFile(configURL, function ($configData)
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
		var conf = this.conf || confObject;
		var canvas = this.canvas;

		var PhysicsManager = this.physicsManager || P2PhysicsManager;
		var svjellyWorld = new SVJellyWorld(new PhysicsManager(conf), conf);

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
			requestID = window.requestAnimationFrame(update);
		};

		window.addEventListener('focus', function () { requestID = window.requestAnimationFrame(update); });
		window.addEventListener('blur', function () { window.cancelAnimationFrame(requestID); });

		requestID = window.requestAnimationFrame(update);
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
		svjellyMaker.createFromPageSVG();
	};
	window.addEventListener('load', windowLoadHandler);
}

module.exports = svjellyMaker;
