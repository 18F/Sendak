#!/usr/bin/env node

var riak_dc = require( 'components/common/js/riak-dc.js' ); // our riak synchronous wrapper
var rrm     = require( 'components/rrm/rrm.js' ); // 'riak relational model'

// var result = riak_dc.put_tuple( 'bucket', 'key', 'value' );
var serial = riak_dc.put_tuple( 'a_new_bucket', {
	keyname1 : 'keyvalue1',
	keyname2 : 'keyvalue2'
} );

/*
serial.then( function (tid) {
	console.log( 'testing put_tuple and get_tuple');
	console.log( 'looking for ' + tid );
	var tuple = riak_dc.get_tuple( 'bucket', tid );
	tuple.then( function (body) {
		console.log( 'BODY: ' + body );
	} )
} );
*/

rrm.get_schema().then( function (s) {
	console.log( 's: ', s );
}, function (e) { console.log( 'e: ', e ) } ).done();
