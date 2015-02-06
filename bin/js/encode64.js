#!/usr/bin/env node

'use strict';

var meta = function () {
	return {
		'args' : {
			'filename' : [ String , 'specify a file for output'   ],
			'encode'   : [ Boolean, 'encode to base64'            ],
			'decode'   : [ Boolean, 'decode from base64 to ascii' ]
		},

		'name'     : 'encode64.js',
		'abstract' : 'to/from base64 encoding'
	}
};

function encode (thing) { return new Buffer( thing ).toString( 'base64' )          }
function decode (thing) { return new Buffer( thing, 'base64' ).toString( 'ascii' ) }

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr

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
	
		if (args['encode'] || (us === 'encode')) {
			if (args['filename']) {
				fs.writeFileSync( args['filename'], encode( blob ) );
			}
			else {
				stdout( encode( blob ) );
			}
		}
		else if (args['decode'] || (us === 'decode')) {
			stdout( decode( blob ) );
		}
		else {
			// Totally not sure how/why we are, but complain politely because We Should
			// Not Be.
			//
			stderr( 'Try --help if this is confusing.' );
		}
	} );
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
