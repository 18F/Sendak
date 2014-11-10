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

// Import sendak supplemental functions
//
var supp = require( 'components/common/js/supplemental.js' );

// parse opts
//
var nopt = require('nopt')
	, noptUsage = require('nopt-usage')
	, Stream    = require('stream').Stream
	, path      = require('path')
	, knownOpts = {
			'username'   : [ Boolean, null ],
			'arn'        : [ Boolean, null ],
			'uid'        : [ Boolean, null ],
			'raw'        : [ Boolean, null ],
			'pattern'    : [ String, null ],
			'help'       : [ Boolean, null ]
		}
	, description = {
			// XXX: WHY WHY WHY WHY
			//
			'username'   : ' Display usernames (e.g., JaneAvriette)',
			'arn'        : ' Display arns (e.g., arn:aws:iam::141234512345:user/JaneAvriette)',
			'uid'        : ' Display uids (e.g., AIXXKLJASDEXEXXASDXXE)',
			'raw'        : ' Just display the records without json (csv)',
			'pattern'    : ' Display only usernames matching a (Node RegExp) pattern',
			'help'       : ' Sets the helpful bit.'
		}
	, defaults = {
			'username'   : true,
			'arn'        : true,
			'uid'        : true,
			'raw'        : false
		}
	, shortHands = {
			'h'          : [ '--help' ],
			'halp'       : [ '--help' ]
		}
	, parsed = nopt(knownOpts, process.argv)
	, usage = noptUsage(knownOpts, shortHands, description, defaults)

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

			// Transform the AWS IAM data into something more
			// machine-and-human-readable.
			//
			// XXX: Since this task was written the schema has changed.
			//
			users.forEach( function (user) { // {{{
				if (parsed['pattern']) {
					var re = new RegExp( parsed['pattern'] );
					var un = user.UserName;
					var matches = re.exec( un );

					if (matches) {
						// Found a match
						iam_users.push( {
							username : user.UserName,
							arn      : user.Arn,
							uid      : user.UserId
						} );
					}
					else {
						// nop
					}
				}
				else {
					iam_users.push( {
						username : user.UserName,
						arn      : user.Arn,
						uid      : user.UserId
					} );
				} // if parsed
			} // users.forEach }}}

			// Display for the user
			//
			var display = [ ];
			iam_users.forEach( function (iam_user) { // {{{
				var record = { };
				if (parsed['username']) {
					record['username'] = iam_user['username']
				}
				if (parsed['arn']) {
					record['arn'] = iam_user['arn']
				}
				if (parsed['uid']) {
					record['uid'] = iam_user['uid']
				}
				display.push( record )
			} // iterate iam_users }}}
			if (parsed['raw']) { // display raw {{{
				display.forEach( function (line) {
					var output = supp.display_raw( line, Object.keys( parsed ) );
					console.log( output ) ;
				} // iterate display
			} // }}} display raw
			else {
				console.log( display )
			} // if raw
		} // if err
	} // callback
) // listUsers
