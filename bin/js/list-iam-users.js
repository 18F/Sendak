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
			for (var idx in users) { // {{{
				if (parsed['pattern']) {
					var re = new RegExp( parsed['pattern'] );
					var un = users[idx].UserName;
					var matches = re.exec( un );

					if (matches) {
						// Found a match
						iam_users.push( {
							username : users[idx].UserName,
							arn      : users[idx].Arn,
							uid      : users[idx].UserId
						} );
					}
					else {
						// nop
					}
				}
				else {
					iam_users.push( {
						username : users[idx].UserName,
						arn      : users[idx].Arn,
						uid      : users[idx].UserId
					} );
				} // if parsed
			} // for users }}}

			// Display for the user
			//
			var display = [ ];
			for (var idx in iam_users) { // {{{
				var record = { };
				if (parsed['username']) {
					record['username'] = iam_users[idx]['username']
				}
				if (parsed['arn']) {
					record['arn'] = iam_users[idx]['arn']
				}
				if (parsed['uid']) {
					record['uid'] = iam_users[idx]['uid']
				}
				display.push( record )
			} // iterate iam_users }}}
			if (parsed['raw']) { // display raw {{{
				for (var idx in display) {
					var output = supp.display_raw( display[ idx ], supp.get_keys( parsed ) );
					console.log( output ) ;
				} // iterate display
			} // }}} display raw
			else {
				console.log( display )
			} // if raw
		} // if err
	} // callback
) // listUsers
