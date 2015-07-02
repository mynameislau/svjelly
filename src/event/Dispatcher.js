var Dispatcher =
{
	fire: function ($topic, $data)
	{
		if (!this._topics || !this._topics[$topic]) { return; }

		var subscribers = this._topics[$topic];
		for (var i = 0, subscribersLength = subscribers.length; i < subscribersLength; i += 1)
		{
			subscribers[i]($data);
		}
	},

	on: function ($topic, $subscriber)
	{
		this._topics = this._topics || {};
		this._topics[$topic] = this._topics[$topic] || [];
		this._topics[$topic].push($subscriber);
	},

	off: function ($topic, $subscriber)
	{
		if (!$topic)
		{
			this._topics = undefined;
			return;
		}
		if (!$subscriber)
		{
			this._topics[$topic] = undefined;
			return;
		}

		if (this._topics[$topic].indexOf($subscriber) === -1)
		{
			throw new Error('No listener');
		}

		this._topics[$topic].splice(this._topics[$topic].indexOf($subscriber), 1);
		this._topics[$topic] = this._topics[$topic].length < 0 ? this._topics[$topic] : undefined;
	}
};

module.exports = Dispatcher;
