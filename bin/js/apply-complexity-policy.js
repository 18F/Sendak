// apply a (e.g., FISMA-ish) complexity policy to your IAM account
//

'use strict';

var meta = function () {
	var mapping = {
		'lower': 'RequireLowercaseCharacters',
		'upper': 'RequireUppercaseCharacters',
		'number': 'RequireNumbers',
		'max-age': 'MaxPasswordAge',
		'symbol': 'RequireSymbols',
		'min-length': 'MinimumPasswordLength',
		'num-old-passwords': 'PasswordReusePrevention',
		'allow-change': 'AllowUsersToChangePassword'
	};

	return {
		'args' : mapping,

		'abstract' : 'applies a password complexity policy',
		'name'     : 'apply-complexity-policy'
	}
}


var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, iam    = Sendak.iam
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr
		, dg     = require( 'deep-grep' )


	iam.UpdateAccountPasswordPolicy( args,
		function( err, data ) {
			if (err) {
				stderr( err, err.stack )
			}
			else {
				// This is stalled until I have a non-18F account to set policy for.
				//
			} // if err
		} // callback
	) // iam.UpdateAccountPasswordPolicy
}

module.exports = plug;
plug.meta      = meta;

// @janearc 🐙👾 // jane@cpan.org // vim:tw=80:ts=2:noet
