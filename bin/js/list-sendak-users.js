#!/usr/bin/env node

/*
  Simply report on the users in Riak.

*/


// parse opts
//
var nopt = require('nopt')
	, noptUsage = require('nopt-usage')
	, Stream    = require('stream').Stream
	, path      = require('path')
	, knownOpts = {
			'username' : [ String, null ],
			'arn'      : [ String, null ],
			'amznid'   : [ String, null ]
		}
	, description = {
			'username' : 'Specify an expression to match against username',
			'arn'      : 'Specify an expression to match against the arn',
			'amznid'   : 'Specify an expression to match against the amznid'
		}
	, defaults = {
			'help' : false
		}
	, shortHands = {
			'h' : [ '--help' ]
		}
	, parsed = nopt(knownOpts, process.argv)
	, usage = noptUsage(knownOpts, shortHands, description, defaults)

if (parsed['help']) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

var rrm = require( 'components/rrm/rrm.js' );

var results = [ ];

var pusers = rrm.get_objects( 'User' ).then( function ( userids ) {
	if (parsed['name']) {
		// push matching records into results
		//
	}
	console.log( 'userids: ', userids )
} );
