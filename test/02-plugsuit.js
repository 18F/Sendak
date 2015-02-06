var assert   = require( 'assert' )
	, chai     = require( 'chai' )
	, plugsuit = require( 'plugsuit' )

it( 'check plugs', function () {
	assert( plugsuit, 'plugsuit ready' );
	assert( plugsuit.init( 'bin/js' ), 'plugsuit initialised' );
	assert( plugsuit.dispatch(
		["node","/Users/jane/dev/sendak/bin/sendak.js","non-existant-task","--arg"]
	), 'plugsuit accepts plugs' );
} );
