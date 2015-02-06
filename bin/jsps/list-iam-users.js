#! /usr/bin/env node

'use strict';

var meta = function () {
	return {
		'args' : {
			'user-name' : [ Boolean, 'Display user names (e.g., JaneAvriette)', ],
			'arn'       : [ Boolean, 'Display arns (e.g., arn:aws:iam::141234512345:user/JaneAvriette)', ],
			'uid'       : [ Boolean, 'Display uids (e.g., AIXXKLJASDEXEXXASDXXE)', ],
			'pattern'   : [ String,  'Display only user names matching a (Node RegExp) pattern', ]
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

	iam.listUsers( { },
		function( err, data ) {
			if (err) {
				stderr( err, err.stack )
			}
			else {
				var users = data.Users;
				var iam_users = [ ];

				// Transform the AWS IAM data into something more
				// machine-and-human-readable.
				//
				users.forEach( function (user) { // {{{
					if (args['pattern']) {
						if (new RegExp( args['pattern'], 'i' ).exec( user.UserName )) {
							// Found a match
							iam_users.push( {
								'user-name' : user.UserName,
								'arn'       : user.Arn,
								'uid'       : user.UserId
							} );
						}
						else {
							// nop
						}
					}
					else {
						iam_users.push( {
							'user-name' : user.UserName,
							'arn'       : user.Arn,
							'uid'       : user.UserId
						} );
					} // if args
				} ); // users.forEach }}}

				// Display for the user
				//
				var display = [ ];
				iam_users.forEach( function (iam_user) { // {{{
					var record = { };
					if (args['user-name']) {
						record['user-name'] = iam_user['user-name']
					}
					if (args['arn']) {
						record['arn'] = iam_user['arn']
					}
					if (args['uid']) {
						record['uid'] = iam_user['uid']
					}
					display.push( record )
				} ); // iterate iam_users }}}
				console.log( display );
			} // if err
		} // callback
	); // listUsers
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
