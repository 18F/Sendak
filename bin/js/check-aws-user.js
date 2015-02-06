#! /usr/bin/env node
// Check to see if a supplied user has the requisite attributes.
//

'use strict';

var meta = function () {
	return {
		'args' : {
			'username': [ String, 'Specify username (e.g., JaneArc)' ],
			'pattern' : [ String, 'Display only usernames matching a (Node RegExp) pattern' ]
		},

		'abstract' : 'verifies certain characteristics (such as MFA) on aws users',
		'name'     : 'check-aws-user'
	}
}

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, iam    = Sendak.iam
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr
		, dg     = require( 'deep-grep' )

	iam.listUsers( { },
		function( err, data ) {
			if (err) {
				console.log( err, err.stack )
			}
			else {
				var users = data.Users;
				var iam_users = [ ];

				dg.deeply( data.Users, function (t) {
					if (args['username']) {
						return (t == args['username']) ? t : false
					}
					else if (args['pattern']) {
						if ( new RegExp( args['pattern'] ).exec( t.UserName ) ) {
							return t;
						}
						else {
							return false;
						}
					}
					else {
						return t;
					}
					return t;
				}, { } ).forEach( function (user) {
					iam.listMFADevices( { 'UserName' : user['UserName'] }, function (err, data) {
						if (data['MFADevices'].length == 0) {
							stdout( user['UserName'] + ' has no MFA devices configured' );
						}
					} );
				} );
			} // if err
		} // callback
	) // listUsers
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
