#!/usr/bin/env node
// parse opts
//
// var clean_args = require( 'components/common/js/supplemental.js' ).fix_quoted_array( process.argv );
var nopt = require('nopt')
	, noptUsage = require('nopt-usage')
	, Stream    = require('stream').Stream
	, path      = require('path')
	, knownOpts = {
			'get-schema'      : [ Boolean, null ],
			'object-types'    : [ Boolean, null ],
			'describe-object' : [ String, null ],
			'help'            : [ Boolean, null ]
		}
	, description = {
			'get-schema'      : 'Return the full (Sendak-specific) schema in Riak',
			'object-types'    : 'List the Sendak object types',
			'describe-object' : 'Describe a specified object from the schema',
			'help'            : 'Sets the helpful bit.'
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
else if (parsed['object-types']) {
	// Display the schema for the user. This is kind of messy.
	//
	rrm.object_types().then( console.log );
}
else if (parsed['describe-object']) {
	// Describe what we know about an object's prototype
	//
	rrm.new_object( parsed['describe-object'] ).then( console.log );
}
