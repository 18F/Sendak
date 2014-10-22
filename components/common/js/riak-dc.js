// Riak is very fancy. Too fancy. This makes it much simpler. Following is
// a set of simple, synchronous blocking calls to get, put, and delete things
// from a Riak ring.
//
// riak don't care dot js
//

var riak_host = 'localhost';
var riak_port = 8098;

var q = require('q'); // promises

function get_buckets () {
	// get_buckets returns a (promise of a) list of all the buckets riak knows about.
	//

	var gotten = '';

	var deferred = q.defer();

	var req = require('http').request( {
		host    : riak_host,
		path    : '/riak/?buckets=true',
		port    : riak_port,
		method  : 'GET',
		headers : {
			'Content-Type' : 'application/json'
		}
	}, function (result) {
		result.on('data', function (chunk) {
			// We assume this will be json that looks like:
			// { buckets: [ 'thing', ... ] }
			//
			var bucket_names = JSON.parse(chunk);
			deferred.resolve( bucket_names['buckets'] );
	} ) } ); // request

	req.on( 'error', function(e) {
		console.log( 'http request barfed at : ' + e.message )
	} );
	req.end();

	return deferred.promise;

} // get_buckets

function get_keys (bucket) {
	// get_tuples keys a (promise of a) list of all the keys that Riak knows 
	// about in a given bucket.
	//

	var gotten = '';

	var deferred = q.defer();

	var path = '/riak/' + bucket + '?keys=true';

	var req = require('http').request( {
		host    : riak_host,
		'path'  : path,
		port    : riak_port,
		method  : 'GET',
		headers : {
			'Content-Type' : 'application/json'
		}
	}, function (result) {
		result.on('data', function (chunk) {
			// We assume this will be json that looks like:
			// { keys: [ 'thing', ... ] }
			//
			var key_names = JSON.parse(chunk);
			deferred.resolve( key_names['keys'] );
	} ) } ); // request

	req.on( 'error', function(e) {
		console.log( 'http request barfed at : ' + e.message )
	} );
	req.end();

	return deferred.promise;

} // get_keys

function get_tuple (bucket, key) {
	// get_tuple cannot return to you the stringy value of the bucket/key tuple,
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

function put_tuple (bucket, payload) {
	// put_tuple will send off your payload and do its best to return a promise
	// which contains a serial from the Riak you may use in the future to refer to it.
	//

	var serial = '';

	var deferred = q.defer();

	var req = require('http').request( {
		host    : riak_host,
		path    : '/riak/' + bucket + '?returnbody=true',
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

		// You must stringify things you post with the request object.
		//
		req.write( JSON.stringify(payload) );

		// Riak returns us something like:
		//
		//   location: '/riak/a_new_bucket/MYUbKWjuO5JvJGEoHHLI3ajfj5B'
		//
		// so we clean it up by taking the key off and then zapping the tick.
		//
		var key = headers['location'].split('/')[3];
		key = key.substr( 0, key.length - 1 );

		// And hand it off to q.
		//
		deferred.resolve( key );
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

exports.get_keys    = get_keys;
exports.get_tuple   = get_tuple;
exports.get_buckets = get_buckets;
exports.put_tuple   = put_tuple;
