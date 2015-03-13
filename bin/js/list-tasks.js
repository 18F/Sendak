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

	plugsuit.plugs.forEach( function (plug) {
		Sendak.stdout( ' * '.concat( plug.meta().name ) );
	} );

	process.exit( 0 );
};

module.exports = plug;
plug.meta      = meta;

// @janearc 🐙👾 // jane@cpan.org // vim:tw=80:ts=2:noet
