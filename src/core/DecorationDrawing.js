var DecorationDrawing =
{
	setScale: function ($scaleX, $scaleY)
	{
		for (var i = 0, length = this.commands.length; i < length; i += 1)
		{
			var command = this.commands[i];
			command.setScale($scaleX, $scaleY);
		}
	}
};

module.exports = DecorationDrawing;
