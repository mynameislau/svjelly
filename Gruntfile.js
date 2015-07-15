module.exports = function(grunt)
{
	grunt.initConfig(
	{
		pkg: grunt.file.readJSON('package.json'),
		jshint:
		{
			default:
			{
				src: ['src/**/*.js'],
				options:
				{
					jshintrc: true
				}
			}
		},
		watch:
		{
			jshint:
			{
				files: ['src/**/*.js'],
				tasks: ['jshint'],
				options:
				{
					livereload: true
				}
			}
		},
		express:
		{
			default:
			{
				options:
				{
					bases: ['./'],
					showStack: true
				}
			}
		},
		browserify:
		{
			svjelly:
			{
				src: 'src/svjelly.js',
				dest: 'build/svjelly.js',
				options:
				{
					watch: true,
					watchifyOptions:
					{
						verbose: true,
						debug: true
					},
					browserifyOptions:
					{
						debug: true,
						standalone: 'svjelly'
					}
				}
			},
			svjellymaker:
			{
				src: 'src/svjellymaker.js',
				dest: 'build/svjellymaker.js',
				options:
				{
					watch: true,
					watchifyOptions:
					{
						debug: true,
						verbose: true
					},
					browserifyOptions:
					{
						debug: true,
						standalone: 'svjelly.Maker'
					}
				}
			},
			PixiRenderer:
			{
				src: 'src/renderer/pixi/PixiRenderer.js',
				dest: 'build/pixirenderer.js',
				options:
				{
					watch: true,
					watchifyOptions:
					{
						debug: true,
						verbose: true
					},
					browserifyOptions:
					{
						debug: true,
						standalone: 'svjelly.PixiRenderer'
					}
				}
			},
			P2PhysicsManager:
			{
				src: 'src/physics/p2physics/P2PhysicsManager.js',
				dest: 'build/P2PhysicsManager.js',
				options:
				{
					watch: true,
					watchifyOptions:
					{
						debug: true,
						verbose: true
					},
					browserifyOptions:
					{
						debug: true,
						standalone: 'SVJellyP2PhysicsManager'
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('server', ['express', 'browserify:svjellymaker', 'browserify:P2PhysicsManager', 'browserify:svjelly', 'browserify:PixiRenderer', 'watch:jshint']);
};