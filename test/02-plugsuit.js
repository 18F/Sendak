var assert   = require( 'assert' )
	, chai     = require( 'chai' )
	, plugsuit = require( 'plugsuit' )

it( 'check plugs', function () {
	assert.ok( plugsuit, 'plugsuit ready' );
	assert.ok( plugsuit.init( 'bin/js' ), 'plugsuit initialised' );
	assert.ok( plugsuit.dispatch(
		["node","/Users/jane/dev/sendak/bin/sendak.js","non-existant-task","--arg"]
	), 'plugsuit accepts plugs' );
	plugsuit.plugs.forEach( function (plug) {
		assert.ok( plug.help_handler, 'plug help handler' );
		assert.ok( plug.argv_handler, 'plug argv handler' );
		// assert.ok( plug.meta, 'plug has meta data' );
		assert.ok( typeof plug.meta() == 'object', 'plug meta handler returns an object' );
	} );
} );
