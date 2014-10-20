// Riak is very fancy. Too fancy. This makes it much simpler. Following is
// a set of simple, synchronous blocking calls to get, put, and delete things
// from a Riak ring.
//
// riak don't care dot js
//

// XXX: I think this is only appearing to be synchronous because it's real fast.
// If this ever actually gets used enough to slow riak down (fat chance), it will
// probably break.
//

var riak_host = 'localhost';
var riak_port = 8098;

function get_bucket (bucket, key) {
	// Without a key, get_bucket is going to return some json for you that describes the bucket.
	// with a key, it's going to return the value of that bucket-key tuple.
	//

	var gotten = '';
	var subpath = key ? bucket + '/' + key : bucket;

	setTimeout( function () {
		var req = require('http').request( {
			host    : riak_host,
			path    : '/riak/' + subpath,
			port    : riak_port,
			method  : 'GET'
		}, function (result) {
			result.on('data', function (chunk) {
				gotten += chunk;
		} ) } )
  
		req.on( 'error', function(e) {
			console.log( 'http request barfed at : ' + e.message )
		} );
		req.end();
	}, 10 ); // settimeout

	return gotten;

} // get_bucket

function put_bucket (target, payload, headers) {
	// helper to just return the body of an http request
	//

	return new request( {
		url       : target,
		method    : 'POST',
		body      : payload,
		'headers' : headers ? headers : {}
	} ).finish().body;

} // _http_post internal function

var init = function ( host, port ) {
	if (host) riak_host = host;
	if (port) riak_port = port;

	return 200;
} // init anonymous function


// Export the things
//

exports.init = init;

exports.get_bucket = get_bucket;
