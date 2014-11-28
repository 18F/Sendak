#! /usr/bin/env node
// List the users in IAM, optionally with pattern supplied as --pattern
//

// Load aws-sdk & iam
//
var AWS = require('aws-sdk');

var iam = new AWS.IAM(
	{
		region: 'us-east-1'  // per @mhart at https://github.com/aws/aws-sdk-js/issues/350
	}
);

// parse opts
//
var parsed = require( 'sendak-usage' ).parsedown( {
	'user-name' : {
		'type'        : [ Boolean ],
		'description' : 'Display user-names (e.g., JaneAvriette)',
		'long-args'   : [ 'user-name' ]
	},
	'arn' : {
		'type'        : [ Boolean ],
		'description' : 'Display arns (e.g., arn:aws:iam::141234512345:user/JaneAvriette)',
		'long-args'   : [ 'arn' ]
	},
	'uid' : {
		'type'        : [ Boolean ],
		'description' : 'Display uids (e.g., AIXXKLJASDEXEXXASDXXE)',
		'long-args'   : [ 'uid' ]
	},
	'pattern' : {
		'type'        : [ String ],
		'description' : 'Display only user-names matching a (Node RegExp) pattern',
		'long-args'   : [ 'pattern' ]
	},
	'raw' : {
		'type'        : [ Boolean ],
		'description' : 'Just display the records without json (csv)',
		'long-args'   : [ 'raw' ]
	},
	'help' : {
		'long-args'   : [ 'help' ],
		'description' : 'Halp the user.',
		'type'        : [ Boolean ]
	},
}, process.argv )
	, nopt  = parsed[0]
	, usage = parsed[1];

if (nopt['help']) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

iam.listUsers( { },
	function( err, data ) {
		if (err) {
			console.log( err, err.stack )
		}
		else {
			var users = data.Users;
			var iam_users = [ ];

			// Transform the AWS IAM data into something more
			// machine-and-human-readable.
			//
			// XXX: Since this task was written the schema has changed.
			//
			users.forEach( function (user) { // {{{
				if (nopt['pattern']) {
					var re = new RegExp( nopt['pattern'] );
					var un = user.UserName;
					var matches = re.exec( un );

					if (matches) {
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
				} // if nopt
			} ); // users.forEach }}}

			// Display for the user
			//
			var display = [ ];
			iam_users.forEach( function (iam_user) { // {{{
				var record = { };
				if (nopt['user-name']) {
					record['user-name'] = iam_user['user-name']
				}
				if (nopt['arn']) {
					record['arn'] = iam_user['arn']
				}
				if (nopt['uid']) {
					record['uid'] = iam_user['uid']
				}
				display.push( record )
			} ); // iterate iam_users }}}
			console.log( display );
		} // if err
	} // callback
) // listUsers
