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
			'list-tuples'  : [ Boolean, null ],
			'bucket'       : [ String, null ],
			'help'         : [ Boolean, null ]
		}
	, description = {
			'list-buckets' : 'Show all the buckets in riak',
			'list-tuples'  : 'List all tuples in a bucket',
			'bucket'       : 'Provided as argument to --list-tuples',
			'help'       : ' Sets the helpful bit.'
		}
	, defaults = {
			'help' : false
		}
	, shortHands = {
			'h'          : [ '--help' ],
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
	var pbuckets = riak_dc.get_buckets();
	pbuckets.then( console.log );
}

if (parsed['list-tuples']) {
	if (parsed['bucket']) {
		var bucket = parsed['bucket'];

		// Get the tuples for a given bucket here
		//
	}
	else {
		console.log( 'You need to supply a bucket name if you want to list tuples.' );
		console.log( usage );
		process.exit( -255 );
	}
}
