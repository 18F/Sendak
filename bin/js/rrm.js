#!/usr/bin/env node
// parse opts
//
// var clean_args = require( 'components/common/js/supplemental.js' ).fix_quoted_array( process.argv );
var nopt = require('nopt')
	, noptUsage = require('nopt-usage')
	, Stream    = require('stream').Stream
	, path      = require('path')
	, knownOpts = {
			'get-schema'   : [ Boolean, null ],
			'help'         : [ Boolean, null ]
		}
	, description = {
			'get-schema'   : 'Return the (Sendak-specific) schema in Riak',
			'help'         : 'Sets the helpful bit.'
		}
	, defaults = {
			'help' : false
		}
	, shortHands = {
			'h'            : [ '--help' ],
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

var rrm  = require( 'components/rrm/rrm.js' ); // the 'orm'

if (parsed['get-schema']) {
	// Display the schema for the user. This is kind of messy.
	//
	rrm.get_schema().then( console.log );
}
