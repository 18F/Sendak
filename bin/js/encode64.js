#!/usr/bin/env node

"use strict";

var parsed = require( 'sendak-usage' ).parsedown( {
	'help'     : { 'type': [ Boolean ], 'description': 'halp me'                     },
	'filename' : { 'type': [ String  ], 'description': 'specify a file for output'   },
	'encode'   : { 'type': [ Boolean ], 'description': 'encode to base64'            },
	'decode'   : { 'type': [ Boolean ], 'description': 'decode from base64 to ascii' }

}, process.argv )
	, usage   = parsed[1]
	, nopt    = parsed[0]
	, stdin   = process.stdin
	, chunks  = [ ];

if ( (nopt['help']) || (nopt['encode'] && nopt['decode']) ) {
	// They are confused.
	//
	console.log( 'Trivial encode/decode from base64. Default is stdout.' );
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0);
}

// Some of this is paraphrased from:
//   https://gist.github.com/kristopherjohnson/5065599
//

// This seems safe enough, I guess.
//
stdin.setEncoding('utf8');

// Why do we do this, again?
//
stdin.resume();

stdin.on( 'data', function (chunk) { chunks.push( chunk ) } );

stdin.on('end', function () {
	// If we've been asked explicitly to encode, or we've been invoked with
	// encode in our name, do the encode thing.
	//
	var us = process.argv[1].split('/').pop().substr(0,6)
		, blob = chunks.join( '' );

	if (nopt['encode'] || (us === 'encode')) {
		if (nopt['filename']) {
			fs.writeFileSync( nopt['filename'], encode( blob ) );
		}
		else {
			console.log( encode( blob ) );
		}
	}
	else if (nopt['decode'] || (us === 'decode')) {
		console.log( decode( blob ) );
	}
	else {
		// Totally not sure how/why we are, but complain politely because We Should
		// Not Be.
		//
		console.log( 'Try --help if this is confusing.' );
	}
});

function encode (thing) { return new Buffer( thing ).toString( 'base64' )          }

function decode (thing) { return new Buffer( thing, 'base64' ).toString( 'ascii' ) }
