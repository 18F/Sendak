// Riak is very fancy. Too fancy. This makes it much simpler. Following is
// a set of simple, synchronous blocking calls to get, put, and delete things
// from a Riak ring.
//
// riak don't care dot js
//

var riak_host = 'localhost';
var riak_port = 8098;

var q = require('q'); // promises

function get_tuple (bucket, key) {
	// get_bucket cannot return to you the stringy value of the bucket/key tuple,
	// because node. so instead we return to you a promise.
	//

	var gotten = '';
	var subpath = key ? bucket + '/' + key : bucket;

	var deferred = q.defer();

	var req = require('http').request( {
		host    : riak_host,
		path    : '/riak/' + subpath,
		port    : riak_port,
		method  : 'GET',
		headers : {
			// this should be switched to json once testing is done
			//
			//'Content-Type' : 'application/json'

			'Content-Type' : 'text/plain'
		}
	}, function (result) {
		result.on('data', function (chunk) {
			gotten = gotten + chunk;
			deferred.resolve( gotten );
	} ) } ); // request

	req.on( 'error', function(e) {
		console.log( 'http request barfed at : ' + e.message )
	} );
	req.end();

	return deferred.promise;

} // get_tuple

function put_tuple (bucket, key, payload) {
	// put_bucket will send off your bucket/key tuple and do its best to
	// let you know if it failed. assuming it succeeds, it will give you back
	// a promise which should contain the serial that Riak gave it.
	//

	var serial = '';

	// XXX: Really you should never not have a 'key' here.
	//
	var subpath = bucket + '/' + key;

	var deferred = q.defer();

	var req = require('http').request( {
		host    : riak_host,
		path    : '/riak/' + subpath + '?returnbody=true',
		port    : riak_port,
		method  : 'POST',
		headers : {
			'Content-Type' : 'application/json',
		}
	} );

	req.on( 'error', function(e) {
		console.log( 'http request barfed at : ' + e.message )
	} );

	req.on( 'response', function ( response ) {
		var headers = response.headers;
		req.write( payload );
		deferred.resolve( headers );
	} );

	// This should be the part that actually posts the data to the server
	//

	req.end();

	return deferred.promise;

} // put_tuple

var init = function ( host, port ) {
	if (host) riak_host = host;
	if (port) riak_port = port;

	return 200;
} // init


// Export the things
//

exports.init = init;

exports.get_tuple = get_tuple;
exports.put_tuple = put_tuple;
