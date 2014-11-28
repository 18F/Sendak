#!/usr/bin/env node

/*
  Simply report on the users in Riak.

*/

// XXX: clearly this is 107% broken/not-finished. fixy.

// parse opts
//
var parsed = require( 'sendak-usage' ).parsedown( {
	'username' : {
		'type'        : [ String ],
		'description' : 'Specify an expression to match against username',
	},
	'arn' : {
		'type'        : [ String ],
		'description' : 'Specify an expression to match against the arn',
	},
	'amznid' : {
		'type'        : [ String ],
		'description' : 'Specify an expression to match against the amznid',
	},
	'help' : {
		'description' : 'Halp the user.',
		'type'        : [ Boolean ]
	}
}, process.argv )
	, usage = parsed[1]
	, nopt  = parsed[0];


if (nopt['help']) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

var rrm = require( 'rrm' );

var results = [ ];

var pusers = rrm.get_objects( 'User' ).then( function ( userids ) {
	if (nopt['name']) {
		// push matching records into results
		//
	}
	console.log( 'userids: ', userids )
} );
