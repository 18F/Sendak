#!/usr/bin/env node

var store = 'var/datastore.json';
if (process.env.SENDAK_DATASTORE) {
	store = process.env.SENDAK_DATASTORE;
}

var ORM      = require( 'components/odorm/odorm.js' );
var metadata = ORM.new_object( 'Project' );

var nopt = require('nopt')
	, noptUsage = require('nopt-usage')
	, knownOpts = {
			'project-name'        : [ String ],
			'with-github-project' : [ String, Array ],
			'with-user'           : [ String, Array ],
			'with-vpc'            : [ String, null ],
			'create-vpc'          : [ Boolean ]
		}
	, description = {
			'project-name'        : 'The ssh key name (not filename) you would use to log into this node with.',
			'with-github-project' : 'The github project name associated with this',
			'with-user'           : 'A security group or several security groups that apply to this node.',
			'with-vpc'            : 'Create a VPC specifically for this project (this is an IAM call)'
		}
	, parsed = nopt(knownOpts, process.argv)
	, usage = noptUsage(knownOpts, description)

if (parsed['help']) {
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
