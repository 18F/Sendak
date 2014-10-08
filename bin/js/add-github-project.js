#!/usr/bin/env node

/*
 https://github.com/18F/18f-slack
*/

var store = 'var/datastore.json';
if (process.env.SENDAK_DATASTORE) {
	store = process.env.SENDAK_DATASTORE;
}

var ORM      = require( 'components/odorm/odorm.js' );
var schema   = ORM.restore_schema( store );
var metadata = ORM.new_object( 'Github_Project' );

var nopt = require('nopt')
	, noptUsage = require('nopt-usage')
	, knownOpts = {
			'github-project-name' : [ String ], // So this is "midas-prod" not "Midas".
			'base-url'            : [ String ]
		}
	, description = {
			'github-project-name' : 'What is the name of this github project',
			'base-url'            : 'The url to be used for a `git clone` operation'
		}
	, shortHands = {
			'h' : [ '--help' ]
		}
	, parsed = nopt(knownOpts, process.argv)
	// XXX: for some reason adding shortHands here causes concatentation.
	// there is an open issue at nopt-usage about this.
	//
	, usage = noptUsage(knownOpts, description)

if (parsed['help']) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

if (parsed['github-project-name'] && parsed['base-url']) {
	metadata['github-project-name'] = parsed['github-project-name'];
	metadata['base-url']            = parsed['base-url'];
	ORM.add_object( 'Github_Project', metadata )
	console.log( metadata );
	process.exit(0); // success
}
else {
	console.log( 'both github-project-name and base-url must be supplied at invocation thx' );
	process.exit(-255); // nope
}
