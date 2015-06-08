module.exports = {
	extend: function ($toExtend, $extension)
	{
		var recur = function ($object, $extend)
		{
			for (var name in $extend)
			{
				if (typeof $extend[name] === 'object' && !Array.isArray($extend[name]) && $extend[name] !== null)
				{
					if ($object[name] === undefined) { $object[name] = {}; }
					recur($object[name], $extend[name]);
				}
				else
				{
					$object[name] = $extend[name];
				}
			}
		};
		recur($toExtend, $extension);

		return $toExtend;
	}
};

