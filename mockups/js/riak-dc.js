#!/usr/bin/env node

var riak_dc = require( 'components/common/js/riak-dc.js' ); // our riak synchronous wrapper

var bucket = riak_dc.get_bucket( 'food' );

console.log( 'got buckit' + bucket );
