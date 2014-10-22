#!/usr/bin/env node

var riak_dc = require( 'components/common/js/riak-dc.js' ); // our riak synchronous wrapper

// var result = riak_dc.put_tuple( 'bucket', 'key', 'value' );
var serial = riak_dc.put_tuple( 'a_new_bucket', {
	keyname1 : 'keyvalue1',
	keyname2 : 'keyvalue2'
} );
var tuple = riak_dc.get_tuple( 'bucket', 'key' );

serial.then( console.log );

tuple.then( console.log )

