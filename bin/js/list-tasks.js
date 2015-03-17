// list tasks in the sendak bin directory
//

'use strict';

var meta = function () {
	return {
		'args' : { },
		'name' : 'list-tasks',
		'abstract' : 'lists the tasks sendak knows about.'
	}
};

var plug = function (args) {
	var Sendak   = require( '../../lib/js/sendak.js' )
		, plugsuit = require( 'plugsuit' )

	plugsuit.init( get_initdir() );

	plugsuit.plugs.forEach( function (plug) {
		Sendak.stdout( ' * '.concat( plug.meta().name ) );
	} );

	process.exit( 0 );
};

module.exports = plug;
plug.meta      = meta;

function get_initdir () { // {{{
	var initdir;
	if (process.env.SENDAK_DIR) {
		initdir = process.env.SENDAK_DIR
	}
	else if (require('fs').existsSync( '/usr/local/lib/node_modules/sendak/bin/js')) {
		initdir = '/usr/local/lib/node_modules/sendak/bin/js';
	}
	else if (require('fs').existsSync( './node_modules/sendak/bin/js' )) {
		initdir = './node_modules/sendak/bin/js';
	}
	return initdir;
} // }}}

// @janearc 🐙👾 // jane@cpan.org // vim:tw=80:ts=2:noet
