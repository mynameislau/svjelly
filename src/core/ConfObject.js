module.exports = {

	definition: 1,
	worldWidth: 20,
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
				nodeRadius: 0.1,
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
				nodeRadius: 0.1,
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
		noCollide:
		{
			physics:
			{
				mass: 1,
				bodyType: 'hard',
				noCollide: true
			}
		},
		cloud:
		{
			physics:
			{
				mass: 1,
				gravityScale: 0,
				bodyType: 'hard',
				noCollide: true
			}
		},
		metal:
		{

			physics:
			{
				mass: 10,
				bodyType: 'hard'
			}
		},
		balloon:
		{
			physics:
			{
				mass: 1,
				gravityScale: -1,
				bodyType: 'hard'
			}
		},
		static:
		{
			fixed: true,
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

