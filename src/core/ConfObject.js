module.exports = {

	definition: 1,
	worldWidth: 20,
	multiCanvas: true,
	wind: 3,
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
				mass: 100,
				bodyType: 'hard'
			}
		},
		stone:
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
				gravityScale: -15,
				bodyType: 'hard'
			}
		},
		tree:
		{
			structure: 'triangulate',
			nodeRadius: 0.013,
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
				mass: 1,
				damping: 0.8,
				structuralMassDecay: 3,
				bodyType: 'soft'
			}
		},
		flora:
		{
			structure: 'line',
			nodeRadius: 0.013,
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
				mass: 1,
				structuralMassDecay: 3,
				bodyType: 'soft'
			}
		},
		rubber:
		{
			structure: 'triangulate',
			nodeRadius: 0.013,
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
				mass: 0.1,
				bodyType: 'soft'
			}
		},
		jelly:
		{
			structure: 'hexaFill',
			innerStructureDef: 0.01,
			nodeRadius: 0.013,
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
				mass: 0.13,
				bodyType: 'soft'
			}
		},
		sponge:
		{
			structure: 'preciseHexaFill',
			innerStructureDef: 0.02,
			nodeRadius: 0.013,
			physics:
			{
				joints:
				{
					default:
					{
						revoluteConstraint:
						{
							stiffness: 1000,
							relaxation: 5
						}
					}
				},
				material: 'rubber',
				mass: 0.13,
				bodyType: 'soft'
			}
		},
		liquid:
		{
			structure: 'hexaFill',
			innerStructureDef: 0.02,
			nodeRadius: 0.08,
			drawNodesSeparately: true,
			physics:
			{
				joints:
				{
				},
				mass: 0.013,
				material: 'liquid',
				bodyType: 'soft'
			}
		},
		rope:
		{
			structure: 'line',
			nodeRadius: 0.013,
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
				mass: 0.13,
				bodyType: 'hard',
				noCollide: true
			}
		},
		leaves:
		{
			physics:
			{
				mass: 0.00013,
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
			friction: 100
		},
		liquid:
		{
			bounciness: 1000,
			friction: 0
		}
	},
	constraints:
	{
		default:
		{
			lockConstraint:
			{
				stiffness: 10000000000000,
				relaxation: 0,
				collideConnected: false
			}
		},
		axis:
		{
			revoluteConstraint:
			{
				stiffness: 10000,
				relaxation: 0.1,
				motor: false,
				collideConnected: false
			}
		},
		shockAbsorber:
		{
			prismaticConstraint:
			{
				stiffness: 10000,
				relaxation: 0.1,
				canRotate: false
			},
			linearSpring:
			{
				stiffness: 400,
				damping: 0.4
			}
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

