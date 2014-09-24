1. git clone https://github.com/takmais/tahzoo-fe-skeleton.git to some directory
2. cd to new directory
3. type npm link (**not sure if this is the right way to do this. But you’re basically creating a symlink of some kind to the yeoman generator installed here.**) 
3. cd.. out of that folder (**just go to the parent directory. not sure why npm won’t install the generator from inside the same directory?**)
4. type npm install -g generator-tahzoo-fe-skeleton
4. create a new project directory and name it whatever you want
5. cd to new directory
6. create a file called "components.json" and paste in the JSON listed below the dotted line (**this file is basically a components and page types manifest. The idea is that we'd add components and pagetypes to each new project as we needed them. After speaking with Josh, he thinks it was be easy to derive this manifest from some schema straight out of Tridion so that the components that we build will perfectly mirror whats in tridion**)
6. from this directory type yo tahzoo-fe-skeleton

------------------------------------------------------------
{
	"components": [
		{
			"name": "component1",
			"hasJS": true,
			"id": "01",
			"description": "used in the header"
		},
		{
			"name": "component2",
			"hasJS": false,
			"id": "02",
			"description": "used in the footer"
		},
		{
			"name": "component3",
			"hasJS": true,
			"id": "03",
			"description": "used in the sidebar"
		}
	],
	"pageTypes": [
		{
			"name": "pagetype_01",
			"description": "stuff for page type 1",
			"includes": {
				"header": true,
				"footer": true
			}
		},
		{
			"name": "pagetype_02",
			"description": "stuff for page type 2",
			"includes": {
				"header": false,
				"footer": true
			}
		}
	]
}
