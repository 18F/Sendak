#!/usr/bin/env node
// quick-and-dirty interface to riak from the shell
//

// parse opts
//
var clean_args = require( 'components/common/js/supplemental.js' ).fix_quoted_array( process.argv );
var nopt = require('nopt')
	, noptUsage = require('nopt-usage')
	, Stream    = require('stream').Stream
	, path      = require('path')
	, knownOpts = {
			'list-buckets' : [ Boolean, null ],
			'list-keys'    : [ Boolean, null ],
			'get-tuple'    : [ Boolean, null ],
			'put-tuple'    : [ Boolean, null ],
			'del-tuple'    : [ Boolean, null ],
			'bucket'       : [ String, null ],
			'key'          : [ String, null ],
			'tuple'        : [ String ],
			'help'         : [ Boolean, null ]
		}
	, description = {
			'list-buckets' : 'Show all the buckets in riak',
			'list-keys'    : 'List all keys in a bucket',
			'get-tuple'    : 'Get a single tuple from a bucket/key pair',
			'put-tuple'    : 'Attempts to write a tuple to Riak; returns the serial Riak generates',
			'del-tuple'    : 'Attempts to delete a tuple front Riak; no return value',
			'bucket'       : 'To specify a bucket for operations',
			'key'          : 'To specify a key for operations',
			'tuple'        : 'To specify tuple for operations - this must be base64-encoded',
			'help'         : 'Sets the helpful bit.'
		}
	, defaults = {
			'help' : false
		}
	, shortHands = {
			'h'            : [ '--help' ],
		}
	, parsed = nopt(knownOpts, clean_args)
	, usage = noptUsage(knownOpts, shortHands, description, defaults)

if (parsed['help']) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

var riak_dc = require( 'components/common/js/riak-dc.js' ); // our riak synchronous wrapper

if (parsed['list-buckets']) {
	// It would be tricky to parse this down and display as raw, so as
	// Sendak shell tools go, this one is just going to emit json.
	//
	var pbuckets = riak_dc.get_buckets();
	pbuckets.then( console.log );
}

if (parsed['list-keys']) {
	if (parsed['bucket']) {
		var bucket = parsed['bucket']
			, pkeys  = riak_dc.get_keys( bucket );
		pkeys.then( console.log )
	}
	else {
		console.log( 'You need to supply a bucket name if you want to list keys.' );
		console.log( usage );
		process.exit( -255 );
	}
}

if (parsed['get-tuple']) {
	if (parsed['bucket'] && parsed['key']) {
		var bucket = parsed['bucket']
			, key = parsed['key']
			, ptuple = riak_dc.get_tuple(bucket, key);

		ptuple.then( console.log );
	}
	else {
		console.log( 'You need to supply a bucket & key name if you want a tuple.' );
		console.log( usage );
		process.exit( -255 );
	}
}

if (parsed['put-tuple']) {
	if (parsed['bucket'] && parsed['tuple']) {
		if (parsed['key']) {
			console.log( 'Please let Riak decide the key to use for this tuple.' );
			console.log( usage );
			process.exit( -255 );
		}

		var bucket = parsed['bucket']
			, tuple = new Buffer(parsed['tuple'], 'base64').toString('ascii')
			, presult = riak_dc.put_tuple(bucket, tuple);

		console.log( 'attempted to place ' + tuple + ' in Riak' );

		presult.then( console.log );
	}
	else {
		console.log( 'You need to supply a bucket and data (a tuple) for this operation.' );
		console.log( usage );
		process.exit( -255 );
	}
}
