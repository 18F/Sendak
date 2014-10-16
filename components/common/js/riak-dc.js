// Riak is very fancy. Too fancy. This makes it much simpler. Following is
// a set of simple, synchronous blocking calls to get, put, and delete things
// from a Riak ring.
//
// riak don't care dot js
//

var Sync = require('sync');

var request   = require('common-node').httpclient.HttpClient;
var riak_host = 'localhost';
var riak_port = 8098;
var riak_base = 'http://' + riak_host + ':' + riak_port + '/riak/';

console.log( request );

function _http_get (target) {
	// helper to just return the body of an http request
	//

	var rval;

	Sync( function () {
		rval = new request( {
			url    : target,
			method : 'GET',
		} ).finish().body;
	} ); // sync+anon function

} // _http_get internal function

function _http_post (target, payload, headers) {
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

	var riak_base = 'http://' + riak_host + ':' + riak_port + '/riak/';
	return 200;
} // init anonymous function

var put = function ( bucket, data ) {

	return rval;
} // put anonymous function

var get = function ( bucket, phrase ) {

	return rval;
} // get anonymous function

var del = function ( bucket, serial ) {

	return rval;
} // del anonymous function

// Export the things
//

exports.init = init;

// XXX: remove me, these are private
//
exports._get  = _http_get;
exports._post = _http_post;

exports.put = put;
exports.get = get;
exports.del = del;
