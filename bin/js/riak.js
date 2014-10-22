#!/usr/bin/env node
// quick-and-dirty interface to riak from the shell
//

// parse opts
//
var nopt = require('nopt')
	, noptUsage = require('nopt-usage')
	, Stream    = require('stream').Stream
	, path      = require('path')
	, knownOpts = {
			'list-buckets' : [ Boolean, null ],
			'list-keys'    : [ Boolean, null ],
			'get-tuple'    : [ Boolean, null ],
			'bucket'       : [ String, null ],
			'key'          : [ String, null ],
			'help'         : [ Boolean, null ]
		}
	, description = {
			'list-buckets' : 'Show all the buckets in riak',
			'list-keys'    : 'List all keys in a bucket',
			'get-tuple'    : 'Get a single tuple from a bucket/key pair',
			'bucket'       : 'Provided as argument to --list-tuples',
			'key'          : 'Provided as argument to --get-tuple',
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
		var bucket = parsed['bucket'];
		var pkeys  = riak_dc.get_keys( bucket );
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
