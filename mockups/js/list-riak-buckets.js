#!/usr/bin/env node

var riak_dc = require( 'components/common/js/riak-dc.js' ); // our riak synchronous wrapper

var pbuckets = riak_dc.get_buckets();

pbuckets.then( console.log );
