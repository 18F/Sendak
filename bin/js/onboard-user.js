'use strict';

// per https://github.com/18F/Sendak/issues/87
//
// arguments:
//   required:
//     - given name (jane)
//     - surname    (arc)
//     - project    (devops)
//   optional:
//     - github id  (janearc)
//     - filename you'd like written to (/tmp/foo.png)
//
// returns:
//   a one-time password (json)
//   an iam login id
//   a qr code on disk (a file name)
//

var meta = function () {
	return {
		'args' : {
			'given-name'   : [ String, 'Specify given name (e.g., jane)' ],
			'sur-name'     : [ String, 'Specify surname (e.g., arc)' ],
			'github-id'    : [ String, 'Where to store the resultant QR code'  ]
		},

		'name'     : 'onboard-user',
		'abstract' : 'create a new user with identity in Sendak and an account in IAM'
	}
}

var plug = function (args) {
	var Sendak   = require( '../../lib/js/sendak.js' )
		, iam      = Sendak.iam
		, stdout   = Sendak.stdout
		, stderr   = Sendak.stderr
		, logger   = Sendak.getlogger()
		, fs       = require('fs')
		, q        = require('q')

		// Promises, promises
		//   https://www.youtube.com/watch?v=H8Q83DPZy6E
		, def_mfa  = q.defer()
		, def_file = q.defer()
}

module.exports = plug;
plug.meta      = meta;

// @janearc 🐙👾 // jane@cpan.org // vim:tw=80:ts=2:noet
