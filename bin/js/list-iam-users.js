#! /usr/bin/env node
// Note that this only shows the AWS IAM users at the moment, and that should
// be changed so that it prefers data from the database and adds as-needed
// from IAM.
//
// Note it is assumed you will filter the output from these commands via the
// shell rather than passing expressions and transformations to this tool.
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
			'help'       : [ Boolean, null ]
		}
	, description = {
			'username'   : ' Display usernames (e.g., JaneAvriette)',
			'arn'        : ' Display arns (e.g., arn:aws:iam::141234512345:user/JaneAvriette)',
			'uid'        : ' Display uids (e.g., AIXXKLJASDEXEXXASDXXE)',
			'raw'        : ' Just display the records without json (csv)',
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
			var sendak_users = [ ]; // spoiler: these are not really sendak users right now

			// Transform the AWS IAM data into something more
			// machine-and-human-readable.
			//
			// XXX: Since this task was written the schema has changed.
			//
			for (var idx in users) { // {{{
				sendak_users.push( {
					username : users[idx].UserName,
					arn      : users[idx].Arn,
					uid      : users[idx].UserId
				} );
			} // for users }}}

			// Display for the user
			//
			var display = [ ];
			for (var idx in sendak_users) { // {{{
				var record = { };
				if (parsed['username']) {
					record['username'] = sendak_users[idx]['username']
				}
				if (parsed['arn']) {
					record['arn'] = sendak_users[idx]['arn']
				}
				if (parsed['uid']) {
					record['uid'] = sendak_users[idx]['uid']
				}
				display.push( record )
			} // iterate sendak_users }}}
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
