#!/usr/bin/env node

var AWS = require('aws-sdk');

var iam = new AWS.IAM( { region: process.env.AWS_REGION });

// parse opts
//
var parsed = require( 'sendak-usage' ).parsedown( {
	'dont' : { 'type' : [ Boolean ], 'description' : 'don\'t actually do this thing.' },
	'help' : { 'type' : [ Boolean ], 'description' : 'Halp the user.' }
	},
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

iam.listUsers( { },
	function( err, data ) {
		if (err) {
			console.log( err, err.stack )
		}
		else {
			data.Users.forEach( function (user) { // {{{
				// do things
			} ); // users.forEach }}}

		} // if err
	} // callback
) // listUsers
