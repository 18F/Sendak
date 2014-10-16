#!/usr/bin/env node

var riak_dc = require( 'components/common/js/riak-dc.js' ); // our riak synchronous wrapper

console.log( riak_dc._get( 'http://www.google.com/' ) );
