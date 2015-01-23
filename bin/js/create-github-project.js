#!/usr/bin/env node

'use strict';

/*
 https://github.com/18F/18f-slack
*/

var store = 'var/datastore.json';
if (process.env.SENDAK_DATASTORE) {
	store = process.env.SENDAK_DATASTORE;
}

var rrm      = require( 'rrm' );
var metadata = rrm.new_object( 'Github_Project' );

var logger  = require( 'log4js' ).getLogger()
	, logwrap = {
		debug : function (s) { if (process.env.DEBUG != undefined) { logger.debug(s) } },
		info  : function (s) { if (process.env.DEBUG != undefined) { logger.info(s) } },
		warn  : function (s) { if (process.env.DEBUG != undefined) { logger.warn(s) } },
		error : function (s) { if (process.env.DEBUG != undefined) { logger.error(s) } },
	};

var parsed = require( 'sendak-usage' ).parsedown( {
	'github-project-name' : {
		'description' : 'What is the name of this github project',
		'type'        : [ String ]
	},
	'base-url' : {
		'description': 'The url to be used for a `git clone` operation',
		'type'       : [ String ]
	},
	'help' : { 'type' : [ Boolean ] },

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

if (nopt['github-project-name'] && nopt['base-url']) {
	metadata['github-project-name'] = nopt['github-project-name'];
	metadata['base-url']            = nopt['base-url'];
	logwrap.debug( 'Adding new object to github-project', metadata );
	rrm.add_object( 'github-project', metadata )
	console.log( JSON.stringify(metadata) );
	process.exit(0); // success
}
else {
	console.log( 'both github-project-name and base-url must be supplied at invocation thx' );
	process.exit(-255); // nope
}
