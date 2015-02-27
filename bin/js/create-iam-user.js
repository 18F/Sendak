'use strict';

var meta = function () {
	return {
		'args' : {
			'user-name'       : [ String,  'Specify the username' ],
			'name'            : [ String,  'Specify the person\'s (given, sur) name' ],
			'dry-run'         : [ Boolean, 'don\'t actually do it.' ]
		},

		'name'     : 'create-iam-user',
		'abstract' : 'creates a new user in the Sendak metadata store'
	}
};

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, iam    = Sendak.iam
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr
		, logger = Sendak.getlogger()

	if (args['user-name']) {
		logger.debug( 'attempting to create new iam user '.concat( args['user-name'] ) );
		Sendak.users.iam.create( args ).then( function (user) {
			stdout( user );
			/* logger.info( 'user created'.concat(
				' ', user['user-name'], ' (', user['serial'], ')'
			) ); */
		} );
	}
	else {
		stderr( 'You need to provide a user name.' );
		process.exit( -255 );
	}
}

module.exports = plug;
plug.meta      = meta;

// @janearc 🐙👾 // jane@cpan.org // vim:tw=80:ts=2:noet
