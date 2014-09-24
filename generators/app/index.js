var yeoman = require('yeoman-generator');

var blackSalmonGenerator = yeoman.generators.Base.extend({
	// ask the user some questions about the project
	// TO-DO: Ask about dependencies maybe?
	promptUser: function() {
		var done = this.async();
		this.prompt([
			{
				name: "siteName",
				message: "What is the name of your site?" 
			}
		], function(answers) {
			this.siteName = answers.siteName;

			done();
		}.bind(this));
	},
	// build out the basic directory structure
	buildScaffolding: function() {
		this.mkdir('src');
			this.mkdir('src/sass');
			this.mkdir('src/js');
			this.mkdir('src/libs');
			this.mkdir('src/plugins');
			this.mkdir('src/jade');
				this.mkdir('src/jade/components');
				this.mkdir('src/jade/includes');
				this.mkdir('src/jade/pagetypes');
		this.mkdir('build');
			this.mkdir('build/html');
				this.mkdir('build/html/components');
			this.mkdir('build/css');
			this.mkdir('build/js');
	},
	// retrieve the file passed into the blacksalmon generator
	// this file contains a list of componets stored as a JSON in the destination folder
	createComponents: function() {
		var manifest = this.readFileAsString(this.destinationRoot() + "/components.json"),
			pageTypes = JSON.parse(manifest)['pageTypes'],
			components = JSON.parse(manifest)['components'];	

		// loop over the components array
		for (var i = 0; i < components.length; i ++) {
			// build directories for each component
			console.log("creating component: ", components[i].name);

			var componentFolder = 'src/jade/components/' + components[i].name;
			this.mkdir(componentFolder);

			// create a context so we can use variables in our templates for passing data from our components.json
			var context = {
				componentName: components[i].name,
				componentDescription: components[i].description
			};
			
			// create the files to go in each component directory
			this.template('_componentjade.jade', componentFolder + '/_default.jade', context);
			this.template('_componentjade.jade', componentFolder + '/style.scss', context);
		}

		// loop over the page type array
		for (var i = 0; i < pageTypes.length; i ++) {
			console.log("creating pagetype: ", pageTypes[i].name);

			var pageTypeFolder = 'src/jade/pagetypes/' + pageTypes[i].name;
			this.mkdir(pageTypeFolder);

			var context = {
				siteName: this.siteName,
				pageTypeName: pageTypes[i].name,
				includeHead: pageTypes[i].includes.header,
				includeFoot: pageTypes[i].includes.footer
			};

			this.template('_pagetypes.jade', pageTypeFolder + '/' + pageTypes[i].name + '.jade', context);
		}
	},
	// copy some files from the templates directory over to the destination directory
	copyMainFiles: function(){
		console.log("copying main files");

	    this.copy("_footer.jade", "src/jade/includes/_footer.jade");
	    this.copy("_header.jade", "src/jade/includes/_header.jade");
	    this.copy("_html.jade", "src/jade/includes/_html.jade");
	    this.copy("_package.json", "package.json"); 
	    this.copy("README.md", "README.md");
	    //this.copy("_gruntfile.js", "Gruntfile.js"); // we dont need to create the gruntfile here because we're creating it below in the installDependencies method
	},
	// install grunt dependencies
	installDependencies: function() {
		console.log("installing dependencies");

		// read dev dependencies from _package.json and _gruntfile
		var dependencies = this.src.readJSON('_package.json'),
			gruntFile = this.readFileAsString(this.sourceRoot() + '/_gruntfile.js');

		var hook   = '//#==== yeoman hook ====#',
			insert = 'grunt.loadNpmTasks("grunt-contrib-connect")';

		var _this = this;

		// TO-DO: make these dependencies dynamic
		if (gruntFile.indexOf(hook) > -1) {
			//this.write(this.destinationRoot() + '/Gruntfile.js', gruntFile.replace(hook, 'grunt.loadNpmTasks("grunt-contrib-watch");\n grunt.loadNpmTasks("grunt-contrib-compass");\n grunt.loadNpmTasks("grunt-contrib-connect");\n grunt.loadNpmTasks("grunt-contrib-compass");\n grunt.loadNpmTasks("grunt-contrib-jade");\n grunt.loadNpmTasks("grunt-contrib-jshint");\n grunt.loadNpmTasks("grunt-contrib-concat");\n grunt.registerTask("build", ["concat", "cssmin"]);'));
				
			var dependenciesToWrite = "";
			for (var key in dependencies.devDependencies) {
				// do not add "grunt" to the gruntfile
				if (key !== 'grunt') {
					dependenciesToWrite += 'grunt.loadNpmTasks("' + key + '");\n';
				}
			};
			
			this.write(this.destinationRoot() + '/Gruntfile.js', gruntFile.replace(hook, dependenciesToWrite));
		}
		else {
			console.log("hook not present")
		}

		// loop over the list of devDependencies in _package.json
		// TO-DO: these could be user inputs from command line instead of hard coded in the generator _package.json
		for (var key in dependencies.devDependencies) {
			console.log("installing dependencies: ", key);
			var done = this.async();
			this.npmInstall([key], {'saveDev': true}, done);
		}
	}
});

module.exports = blackSalmonGenerator;