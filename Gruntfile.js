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
				tasks: ['jshint']
			},
			browserifySVJellyMaker:
			{
				files: ['src/**/*.js'],
				tasks: ['browserify:svjellymaker']
			},
			browserifySVJelly:
			{
				files: ['src/svjelly.js', 'src/core/**/*.js', 'src/renderer/svjelly/**/*.js'],
				tasks: ['browserify:svjelly']
			}
		},
		express:
		{
			default:
			{
				options:
				{
					bases: ['build', 'examples'],
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
					browserifyOptions:
					{
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
					browserifyOptions:
					{
						standalone: 'svjellymaker'
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('overwatch', ['watch:jshint', 'watch:browserifySVJelly', 'watch:browserifySVJellyMaker']);
	grunt.registerTask('server', ['express', 'watch']);
};