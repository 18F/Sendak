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

	Sendak.stdout( plugsuit.plugs.forEach( function (plug) {
		return ' * '.concat( plug.meta.name )
	} ).join( '\n' ) );
	process.exit( 0 );
};

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
