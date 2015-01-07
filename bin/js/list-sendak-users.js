#!/usr/bin/env node

'use strict';

var parsed = require( 'sendak-usage' ).parsedown( {
	'user-name' : {
		'type'        : [ String ],
		'description' : 'Specify an expression to match against username',
	},
	'arn' : {
		'type'        : [ String ],
		'description' : 'Specify an expression to match against the arn',
	},
	'user-id' : {
		'type'        : [ String ],
		'description' : 'Specify an expression to match against the user-id',
	},
	'help' : {
		'description' : 'Halp the user.',
		'type'        : [ Boolean ]
	}
}, process.argv )
	, usage = parsed[1]
	, nopt  = parsed[0];


if (nopt['help'] || (Object.keys(nopt).length == 0)) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

var rrm = require( 'rrm' );

var results = [ ];

// This is a little buggy and doesn't always display the requested stuff
//
var pusers = rrm.get_objects( 'user' ).then( function ( users ) {
	users.forEach( function (user) {
		var json = JSON.parse( user );
		var result = { };
		Object.keys( nopt ).forEach( function (req_key) {
			if (json[req_key]) { result[req_key] = json[req_key] }
		} )
		results.push( result )
	} )
	console.log( results );
} );

