module.exports = {

	definition: 1,
	worldWidth: 150,
	multiCanvas: true,
	wind: 5,
	debug: true,
	simRenderFreq: 50,
	gravity: [0, -9.8],
	groups:
	{
		default: { fixed: true, physics: { bodyType: 'ghost' } },
		ghost: { fixed: true, physics: { bodyType: 'ghost' } },
		soft:
		{
			structure: 'triangulate',
			physics:
			{
				distanceConstraint:
				{
					stiffness: 100000,
					relaxation: 1
				},
				nodeRadius: 0.1,
				mass: 1,
				bodyType: 'soft'
			}
		},
		tree:
		{
			structure: 'triangulate',
			physics:
			{
				distanceConstraint: null,
				lockConstraint:
				{
					stiffness: 10000,
					relaxation: 0.9
				},
				mass: 5,
				damping: 0.8,
				nodeRadius: 0.1,
				structuralMassDecay: 3,
				bodyType: 'soft'
			}
		},
		flora:
		{
			structure: 'line',
			physics:
			{
				distanceConstraint: null,
				lockConstraint:
				{
					stiffness: 100000,
					relaxation: 1
				},
				mass: 100,
				nodeRadius: 0.1,
				structuralMassDecay: true,
				bodyType: 'soft'
			}
		},
		jelly:
		{
			structure: 'hexaFill',
			innerStructureDef: 0.01,
			physics:
			{
				distanceConstraint: null,
				lockConstraint:
				{
					stiffness: 1000000,
					relaxation: 10
				},
				mass: 10,
				bodyType: 'soft'
			}
		},
		line:
		{
			structure: 'line',
			physics:
			{
				distanceConstraint: null,
				lockConstraint:
				{
					stiffness: 10,
					relaxation: 1
				},
				nodeRadius: 0.1,
				mass: 1,
				bodyType: 'soft'
			}
		},
		rope:
		{
			structure: 'line',
			physics:
			{
				distanceConstraint:
				{
					stiffness: 1000,
					relaxation: 1
				},
				nodeRadius: 0.1,
				mass: 1,
				bodyType: 'soft'
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
				mass: 0.1,
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
		wood:
		{
			physics:
			{
				mass: 1,
				bodyType: 'hard'
			}
		},
		balloon:
		{
			physics:
			{
				mass: 0.01,
				gravityScale: -10,
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
		}
	}
};

