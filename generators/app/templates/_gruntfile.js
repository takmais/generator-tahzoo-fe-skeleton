module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			css: {
				files: ['src/**/*.{scss,sass}'],
				tasks: ['cssmin']
			},
			html: {
				files: ['src/**/*.jade'],
				tasks: ['jade']
			},
			js: {
				files: ['src/**/*.js', 'Gruntfile.js'],
				tasks: ['concat', 'uglify']
			}
		},
		concat: {
		    dist: {
		        src: ['src/**/*.js'],
		        dest: 'build/js/main.js'
		    }
		},
		uglify: {
			dist: {
				src: ['<%= concat.dist.dest %>'],
				dest: 'build/js/main.min.js'
			}
		},
		cssmin: {
		    dist: {
		    	src: ['src/jade/components/**/*.scss', 'src/jade/pagetypes/**/*.scss', 'src/sass/*.scss'],
		    	dest: 'build/css/main.css'
		    }
		},
		jade: {
			compile: {
				files: [
					{
						expand: true,
						cwd: 'src/jade',
						src: ['**/*.jade'],
						dest: 'build/html',
						ext: '.html',
						extDot: 'first'
					}
				]
			}
		}
	});

	// do not remove this "hook." It is used by the Yeoman generator to place grunt.loadNpmTasks() methods
	//#==== yeoman hook ====#
	

	grunt.registerTask('default', ['watch']);
};