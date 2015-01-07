#!/usr/bin/env node

'use strict';

var parsed = require( 'sendak-usage' ).parsedown( {
	'user-name' : { 'type' : [ Boolean ], 'description' : 'Display usernames' },
	'arn'       : { 'type' : [ Boolean ], 'description' : 'Display arn\'s' },
	'user-id'   : { 'type' : [ Boolean ], 'description' : 'Display user-id\'s' },
	'pattern'   : { 'type' : [ String ],  'description' : 'Pattern to match returned data against' },

	'help'      : { 'type' : [ Boolean ], 'description' : 'Halp the user.' }
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
			if (json.hasOwnProperty( req_key )) { result[req_key] = json[req_key] }
		} )
		results.push( result )
	} )
	if (nopt['pattern']) {
		var rx = new RegExp( nopt['pattern'] );
		console.log( results.filter( function (record) {
			var found = false;
			record.forEach( function (field) { if (rx.test( field )) { found = true } } );
			if (found == true) { return record }
			else { /* NOP; we didn't find it */ }
		} ) );
	}
	else {
		console.log( results );
	}
} );
