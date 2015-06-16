module.exports = {

	definition: 1,
	worldWidth: 60,
	wind: 1,
	debug: false,
	simRenderFreq: 50,
	gravity: [0, -9.8],
	groups:
	{
		default: { physics: { bodyType: 'ghost' } },
		ghost: { physics: { bodyType: 'ghost' } },
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
				mass: 1
			}
		},
		tree:
		{
			structure: 'triangulate',
			physics:
			{
				distanceConstraint:null,
				lockConstraint:
				{
					stiffness: 1000000,
					relaxation: 0.9
				},
				mass: 10,
				damping: 0.8,
				nodeRadius: 0.1,
				structuralMassDecay: 6
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
				structuralMassDecay: true
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
				mass: 10
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
				mass: 1
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
				mass: 100,
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
				mass: 1,
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

