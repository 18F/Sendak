'use strict';

var meta = function () {
	return {
		'args' : {
			'user-name'   : [ String, 'Specify username (e.g., JaneAvriette)' ],
			'output-file' : [ String, 'Where to store the resultant QR code'  ]
		},

		'name'     : 'configure-iam-mfa-device',
		'abstract' : 'configure an MFA device for IAM users (such as during onboarding)'
	}
}

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, iam    = Sendak.iam
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr

	Sendak.users.iam.mfa.create( ).then( function () {
		stdout( arguments )
	} );
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
