#!/usr/bin/env node

var rrm      = require( 'rrm' );
var metadata = rrm.new_object( 'Project' );

var parsed = require( 'sendak-usage' ).parsedown( {
	'project-name' : {
		'description' : 'The ssh key name (not filename) you would use to log into this node with.',
		'long-args'   : [ 'project-name' ],
		'type'        : [ String ]
	},
	'with-github-project' : {
		'description' : 'The github project name associated with this',
		'type'        : [ String, Array ],
		'long-args'   : [ 'with-github-project' ]
	},
	'with-user' : {
		'type'        : [ String ],
		'description' : 'A security group or several security groups that apply to this node.',
		'long-args'   : [ 'with-user' ]
	},
	'with-vpc' : {
		'type'        : [ String ],
		'description' : 'Specify the vpc this project should be associated with',
		'long-args'   : [ 'with-vpc' ]
	},
	'create-vpc' : {
		'description' : 'Create a VPC specifically for this project (this is an IAM call)',
		'type'        : [ Boolean ],
		'long-args'   : [ 'create-vpc' ]
	},
	'help' : {
		'long-args'   : [ 'help' ],
		'description' : 'Halp the user.',
		'type'        : [ Boolean ]
	}
}, process.argv )
	, nopt  = parsed[0]
	, usage = parsed[1];

if (nopt['help']) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

/*
	Next:
	 * Pull the github projects out of the db
	 * Verify the github project exists. ("grep")
	 * Apply new object if that's successful
*/
