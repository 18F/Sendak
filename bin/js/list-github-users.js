// mostly provided for consistency rather than utility
//

'use strict';

var meta = function () {
	return {
		'args' : {
			'user-name' : [ Boolean, 'Display user names (e.g., janearc)' ],
			'org'       : [ Boolean, 'The org you wish to query for (default: 18F)' ],
			'pattern'   : [ String,  'Display only user names matching a (Node RegExp) pattern' ]
		},

		'name'     : 'list-github-users',
		'abstract' : 'displays a list of the users in github for a given org'
	}
};

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr

	var pusers = Sendak.users.github.get( args );

	pusers.then( function (users) {
		if (users.length < 1) {
			stderr( 'failed to retrieve any users.' );
		}
		else {
			stdout( users );
		}
	}
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
