module.exports = {

	definition: 1,
	worldWidth: 60,
	wind: 10,
	debug: true,
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
				lockConstrainte:
				{
					stiffness: 100000,
					relaxation: 1
				},
				linearSPrings:
				{
					stiffness: 1000,
					damping: 1
				},
				rotationalSpringf:
				{
					stiffness: 10000,
					damping: 1
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
				distanceConstraint:
				{
					stiffness: 1000000000000000,
					relaxation: 0.9
				},
				lockConstraintdez:
				{
					stiffness: 1000000000000000,
					relaxation: 1
				},
				linearSPrings:
				{
					stiffness: 100000,
					damping: 1
				},
				mass: 0.00000000000000000000001,
				nodeRadius: 0.1,
				damping: 1,
				inertia: 1,
				angularDamping: 1
			}
		},
		jelly:
		{
			structure: 'hexaFill',
			innerStructureDef: 0.01,
			physics:
			{
				distanceConstraint:
				{
					stiffness: 100,
					relaxation: 10
				},
				nodeRadius: 0.1,
				mass: 0.001
			}
		},
		line:
		{
			structure: 'line',
			physics:
			{
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
		}
	}
};

