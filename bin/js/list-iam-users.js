'use strict';

var meta = function () {
	return {
		'args' : {
			'user-name' : [ Boolean, 'Display user names (e.g., JaneAvriette)' ],
			'arn'       : [ Boolean, 'Display arns (e.g., arn:aws:iam::141234512345:user/JaneAvriette)', ],
			'uid'       : [ Boolean, 'Display uids (e.g., AIXXKLJASDEXEXXASDXXE)' ],
			'pattern'   : [ String,  'Display only user names matching a (Node RegExp) pattern' ]
		},

		'name'     : 'list-iam-users',
		'abstract' : 'displays a list of the users in iam with an optionally-supplied pattern'
	}
};

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, iam    = Sendak.iam
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr

	var pusers = Sendak.users.iam.get( args );

	// Note: this returns a *promise* not a thing.
	//
	pusers.then( function (users) {
		if (users.length < 1) {
			stderr( 'failed to retrieve any users.' );
		}
		else {
			users.forEach( function (user) {
				stdout( user );
			} )
		}
	} )
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
