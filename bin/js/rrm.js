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

			'get-objects'     : [ Boolean, null ],

			'add-object'      : [ Boolean, null ],
			'object-type'     : [ String, null ],
			'tuple'           : [ String, null ],

			'help'            : [ Boolean, null ]
		}
	, description = {
			'get-schema'      : 'Return the full (Sendak-specific) schema in Riak',
			'object-types'    : 'List the Sendak object types',
			'describe-object' : 'Describe a specified object from the schema',

			'get-objects'     : 'Lists all the objects of a specified type in Riak, by key',

			'add-object'      : 'Attempts to place an object in rrm',
			'object-type'     : 'Used with add-object/get-objects to specify the type of object',
			'tuple'           : 'The base64-encoded object you wish to store with add-object',

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

var rrm  = require( 'rrm' );

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
else if (parsed['add-object']) {
	if ((! parsed['tuple'] ) || (! parsed['object-type'])) {
		console.log( 'Usage: ' );
		console.log( usage );
		process.exit( -255 ); // oops
	}
	
	var tuple = new Buffer(parsed['tuple'], 'base64').toString('ascii');

	// this should be a serial from Riak.
	//
	rrm.add_object( parsed['object-type'], tuple ); // .then( console.log );
}
else if (parsed['get-objects']) {
	if (! parsed['object-type']) {
		console.log( 'Usage: ' );
		console.log( usage );
		process.exit( -255 ); // oops
	}
	rrm.get_objects( parsed['object-type'] ).then( console.log );
}
