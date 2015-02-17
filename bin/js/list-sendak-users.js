#!/usr/bin/env node

'use strict';

var meta = function () {
	return {
		'args' : {
			'user-name' : [ Boolean, 'Display usernames' ],
			'arn'       : [ Boolean, 'Display arn\'s' ],
			'user-id'   : [ Boolean, 'Display user-id\'s' ],
			'pattern'   : [ String,  'Pattern to match returned data against' ]
		},

		'name'     : 'list-sendak-users',
		'abstract' : 'gives a list of the users in the Sendak metadata repository'
	}
};

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, users  = Sendak.users.sendak.get( args )
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr;

	var results = [ ];

	// Note: this returns a *promise* not a thing.
	//
	if (users.length < 1) {
		stderr( 'failed to retrieve any users.' );
	}
	else {
		stdout( users );
	}
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
