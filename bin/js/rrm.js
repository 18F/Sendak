#!/usr/bin/env node

var parsed = require( 'sendak-usage' ).parsedown( {
	'get-schema' : {
		'type'        : [ Boolean ],
		'description' : 'Return the full (Sendak-specific) schema in Riak',
	},
	'object-types' : {
		'type'        : [ Boolean ],
		'description' : 'List the Sendak object types',
	},
	'describe-object' : {
		'type'        : [ String ],
		'description' : 'Describe a specified object from the schema',
	},

	'get-objects' : {
		'type'        : [ Boolean ],
		'description' : 'Lists all the objects of a specified type in Riak, by key',
	},

	'add-object' : {
		'type'        : [ Boolean ],
		'description' : 'Attempts to place an object in rrm',
	},
	'object-type' : {
		'type'        : [ String ],
		'description' : 'Used with add-object/get-objects to specify the type of object',
	},

	'tuple' : {
		'type'        : [ String ],
		'description' : 'The base64-encoded object you wish to store with add-object',
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

var rrm  = require( 'rrm' );

if (nopt['get-schema']) {
	// Display the schema for the user. This is kind of messy.
	//
	rrm.get_schema().then( console.log );
}
else if (nopt['object-types']) {
	// Display the schema for the user. This is kind of messy.
	//
	rrm.object_types().then( console.log );
}
else if (nopt['describe-object']) {
	// Describe what we know about an object's prototype
	//
	rrm.new_object( nopt['describe-object'] ).then( console.log );
}
else if (nopt['add-object']) {
	if ((! nopt['tuple'] ) || (! nopt['object-type'])) {
		console.log( 'Usage: ' );
		console.log( usage );
		process.exit( -255 ); // oops
	}
	
	var tuple = new Buffer(nopt['tuple'], 'base64').toString('ascii');

	// this should be a serial from Riak.
	//
	rrm.add_object( nopt['object-type'], tuple ); // .then( console.log );
}
else if (nopt['get-objects']) {
	if (! nopt['object-type']) {
		console.log( 'Usage: ' );
		console.log( usage );
		process.exit( -255 ); // oops
	}
	rrm.get_objects( nopt['object-type'] ).then( console.log );
}
