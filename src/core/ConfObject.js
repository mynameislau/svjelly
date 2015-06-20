module.exports = {

	definition: 1,
	worldWidth: 150,
	multiCanvas: true,
	wind: 5,
	debug: false,
	simRenderFreq: 50,
	gravity: [0, -9.8],
	groups:
	{
		default: { fixed: true, physics: { bodyType: 'ghost' } },
		ghost: { fixed: true, physics: { bodyType: 'ghost' } },
		soft:
		{
			structure: 'triangulate',
			nodeRadius: 0.1,
			physics:
			{
				distanceConstraint:
				{
					stiffness: 100000,
					relaxation: 1
				},
				mass: 1,
				bodyType: 'soft'
			}
		},
		tree:
		{
			structure: 'triangulate',
			nodeRadius: 0.1,
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
				structuralMassDecay: 3,
				bodyType: 'soft'
			}
		},
		flora:
		{
			structure: 'line',
			nodeRadius: 0.1,
			physics:
			{
				distanceConstraint: null,
				lockConstraint:
				{
					stiffness: 1000,
					relaxation: 1
				},
				mass: 0.1,
				structuralMassDecay: 3,
				bodyType: 'soft'
			}
		},
		jelly:
		{
			structure: 'hexaFill',
			innerStructureDef: 0.01,
			nodeRadius: 0.1,
			physics:
			{
				distanceConstraint:
				{
					stiffness: 10000,
					relaxation: 30
				},
				mass: 1,
				bodyType: 'soft'
			}
		},
		line:
		{
			structure: 'line',
			nodeRadius: 0.1,
			physics:
			{
				distanceConstraint: null,
				lockConstraint:
				{
					stiffness: 10,
					relaxation: 1
				},
				mass: 1,
				bodyType: 'soft'
			}
		},
		rope:
		{
			structure: 'line',
			nodeRadius: 0.1,
			physics:
			{
				distanceConstraint:
				{
					stiffness: 1000,
					relaxation: 1
				},
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
		leaves:
		{
			physics:
			{
				mass: 0.001,
				gravityScale: 0,
				bodyType: 'hard',
				noCollide: true
			}
		}
	}
};

