module.exports = {

	definition: 1,
	worldWidth: 20,
	multiCanvas: true,
	wind: 0,
	debug: true,
	gravity: [0, -9.8],
	groups:
	{
		default: { fixed: true, physics: { bodyType: 'ghost' } },
		ghost: { fixed: true, physics: { bodyType: 'ghost' } },
		metal:
		{
			physics:
			{
				mass: 1,
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
				mass: 0.5,
				gravityScale: 1,
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
					[
						{
							type: 'lockConstraint',
							stiffness: 10000,
							relaxation: 0.9
						}
					]
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
					[
						{
							type: 'lockConstraint',
							stiffness: 1000,
							relaxation: 1
						}
					]
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
					default: [
						{
							type: 'distanceConstraint',
							stiffness: 100000,
							relaxation: 1
						}
					]
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
					[
						{
							type: 'distanceConstraint',
							stiffness: 10000,
							relaxation: 30
						}
					]
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
					[
						{
							type: 'revoluteConstraint',
							stiffness: 1000,
							relaxation: 5
						}
					]
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
					[
						{
							type: 'distanceConstraint',
							stiffness: 1000,
							relaxation: 1
						}
					]
				},
				mass: 0.1,
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
				mass: 1,
				windResistance: 0,
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
		[
			{
				type: 'lockConstraint',
				stiffness: 10000000000000,
				relaxation: 0.1,
				collideConnected: false
			}
		],
		axis:
		[
			{
				type: 'revoluteConstraint',
				stiffness: 1000000000000,
				relaxation: 0.1,
				motor: false,
				collideConnected: false
			}
		],
		shockAbsorber:
		[
			{
				type: 'prismaticConstraint',
				stiffness: 100000000000000,
				relaxation: 1,
				canRotate: false,
				upperLimit: 1,
				lowerLimit: 0
			},
			{
				type: 'linearSpring',
				stiffness: 1,
				damping: 0.1
			}
		],
		wire:
		[
			{
				type: 'distanceConstraint',
				stiffness: 10000000000000000000000,
				relaxation: 0.1
			}
		],
		spring:
		[
			{
				type: 'distanceConstraint',
				stiffness: 100000,
				relaxation: 0.1
			}
		],
		continuousMotor:
		[
			{
				type: 'revoluteConstraint',
				motor: true,
				continuousMotor: true,
				motorPower: 4
			}
		]
	}
};

