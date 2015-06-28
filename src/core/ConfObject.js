module.exports = {

	definition: 1,
	worldWidth: 150,
	multiCanvas: true,
	wind: 5,
	debug: false,
	gravity: [0, -9.8],
	groups:
	{
		default: { fixed: true, physics: { bodyType: 'ghost' } },
		ghost: { fixed: true, physics: { bodyType: 'ghost' } },
		metal:
		{
			physics:
			{
				mass: 10,
				bodyType: 'hard'
			}
		},
		stone:
		{
			physics:
			{
				mass: 5,
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
				gravityScale: -15,
				bodyType: 'hard'
			}
		},
		tree:
		{
			structure: 'triangulate',
			nodeRadius: 0.1,
			physics:
			{
				joints:
				{
					default:
					{
						distanceConstraint: null,
						lockConstraint:
						{
							stiffness: 10000,
							relaxation: 0.9
						}
					}
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
				joints:
				{
					default:
					{
						distanceConstraint: null,
						lockConstraint:
						{
							stiffness: 1000,
							relaxation: 1
						}
					}
				},
				mass: 0.1,
				structuralMassDecay: 3,
				bodyType: 'soft'
			}
		},
		rubber:
		{
			structure: 'triangulate',
			nodeRadius: 0.1,
			physics:
			{
				joints: {
					default: {
						distanceConstraint:
						{
							stiffness: 100000,
							relaxation: 1
						}
					}
				},
				mass: 1,
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
				joints:
				{
					default:
					{
						distanceConstraint:
						{
							stiffness: 10000,
							relaxation: 30
						}
					}
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
				joints:
				{
					default:
					{
						distanceConstraint:
						{
							stiffness: 1000,
							relaxation: 1
						}
					}
				},
				mass: 1,
				bodyType: 'soft'
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
	},
	materials:
	{
		default:
		{
			bounciness: 1,
			friction: 0.5
		},
		rubber:
		{
			bounciness: 10,
			friction: 1
		}
	},
	constraints:
	{
		default:
		{
			lockConstraint: {}
		},
		wire:
		{
			distanceConstraint:
			{
				stiffness: 1000,
				relaxation: 1
			}
		},
		spring:
		{
			distanceConstraint:
			{
				stiffness: 100000,
				relaxation: 0
			}
		},
		continuousMotor:
		{
			revoluteConstraint:
			{
				motor: true,
				continuousMotor: true,
				motorPower: 4
			}
		}
	}
};

