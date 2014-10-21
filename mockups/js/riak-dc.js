#!/usr/bin/env node

var riak_dc = require( 'components/common/js/riak-dc.js' ); // our riak synchronous wrapper

var result = riak_dc.put_tuple( 'food', 'favorite', 'unagi' );
var tuple = riak_dc.get_tuple( 'food', 'favorite' );

result.then(
	tuple.then( console.log )
);

