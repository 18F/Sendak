#! /usr/bin/env node
// Check to see if a supplied user has the requisite attributes.
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
	'username'   : {
		'long-args' : [ 'username' ],
		'description' : 'Specify username (e.g., JaneAvriette)',
		'type'        : [ String ]
	},
	'raw' : {
		'type'        : [ Boolean ],
		'description' : 'Just display the records without json (csv)',
		'long-args'   : [ 'raw' ],
	},
	'pattern' : {
		'type'        : [ String ],
		'description' : 'Display only usernames matching a (Node RegExp) pattern',
		'long-args'   : [ 'pattern' ]
	},
	'help' : {
		'long-args'   : [ 'help' ],
		'description' : 'Halp the user.',
		'type'        : [ Boolean ]
	},
}, process.argv )
	, nopt  = parsed[0]
	, usage = parsed[1]

if (parsed['help']) {
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

			require( 'jagrep' ).sync( { 'function': function (t) {
				if (parsed['username']) {
					return (t == parsed['username']) ? t : false
				}
				else if (parsed['pattern']) {
					if ( new RegExp( parsed['pattern'] ).exec( t.UserName ) ) {
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
			} }, data.Users ).forEach( function (user) {
				iam.listMFADevices( { 'UserName' : user['UserName'] }, function (err, data) {
					if (data['MFADevices'].length == 0) {
						console.log( user['UserName'] + ' has no MFA devices configured' );
					}
				} );
			} );
		} // if err
	} // callback
) // listUsers
