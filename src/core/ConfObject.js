module.exports = {

	definition: 1,
	worldWidth: 500,
	simRenderFreq: 50,
	gravity: [0, -9.8],
	groups:
	{
		default:
		{
			structure: 'preciseHexaFill',
			innerStructureDef: 0.04,
			physics:
			{
				distanceConstraint:
				{
					stiffness: 500,
					relaxation: 0.1
				},
				nodesDiameter: 1,
				mass: 1
			}
		},
		line:
		{
			structure: 'line',
			physics:
			{
				distanceConstraint:
				{
					stiffness: 500,
					relaxation: 0.1
				},
				nodesDiameter: 1,
				mass: 1
			}
		},
		hard:
		{
			physics:
			{
				mass: 1,
				bodyType: 'hard'
			}
		},
		static:
		{
			physics:
			{
				mass: 0,
				bodyType: 'hard'
			}
		},
		ghost:
		{
			physics:
			{
				bodyType: 'ghost'
			}
		}
	}
};

