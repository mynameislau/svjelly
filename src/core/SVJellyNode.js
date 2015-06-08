var SVJellyNode = function ($oX, $oY, $options)
{
	this.jointsArray = [];
	this.oX = $oX;
	this.oY = $oY;
	this.drawing = undefined;
	this.fixed = false;
	this.isStart = false;
	this.endNode = undefined;
	this.setOptions($options);
};

//raccourci
SVJellyNode.prototype.setOptions = function ($options)
{
	if ($options)
	{
		// var = $ === undefined ? {} : $options;
		if ($options.fixed !== undefined) { this.fixed = $options.fixed; }
	}
};

SVJellyNode.prototype.getX = function ()
{
	return this.physicsManager.getX();
};

//raccourci
SVJellyNode.prototype.getY = function ()
{
	return this.physicsManager.getY();
};

module.exports = SVJellyNode;

