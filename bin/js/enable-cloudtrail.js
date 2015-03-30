// simply turn on cloudtrail for all regions.
//

'use strict';

var meta = function () {
	return {
		'args' : {

		},

		'abstract' : 'turns on cloud trail for the current account',
		'name'     : 'enable-cloudtrail'
	}
}

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, ct     = Sendak.cloudtrail
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr
		, dg     = require( 'deep-grep' )

	ct.createTrail( args,
		function( err, data ) {
			if (err) {
				stderr( err, err.stack )
			}
			else {
				// This is stalled until I have a non-18F account to set policy for.
				//
			} // if err
		} // callback
	) // ct.createTrail
}

module.exports = plug;
plug.meta      = meta;

// @janearc 🐙👾 // jane@cpan.org // vim:tw=80:ts=2:noet
