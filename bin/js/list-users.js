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
			'raw'        : [ Boolean, null ]
		}
	, description = {
			'username'   : 'Display usernames (e.g., JaneAvriette)',
			'arn'        : 'Display arns (e.g., arn:aws:iam::141234512345:user/JaneAvriette)',
			'uid'        : 'Display uids (e.g., AIXXKLJASDEXEXXASDXXE)',
			'raw'        : 'Just display the records without json (csv)'
		}
	, defaults = {
			'username'   : true,
			'arn'        : true,
			'uid'        : true,
			'raw'        : false
		}
	, shortHands = { }
	, parsed = nopt(knownOpts, process.argv)
	, usage = noptUsage(knownOpts, description, defaults)

iam.listUsers( { },
	function( err, data ) {
		if (err) {
			console.log( err, err.stack )
		}
		else {
			// does iam have a .waitFor?
			// https://github.com/18F/DevOps/blob/master/sendak/components/aws/run_instance.js#L128
			//
			var users = data.Users;
			var sendak_users = [ ];

			// Transform the AWS IAM data into something more
			// machine-and-human-readable.
			//
			// XXX: Since this atom was written the schema has changed.
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
			if (parsed['raw']) {
				var raw_display = '';
				for (var idx in display) {
					// console.log( display[idx] )
					if (display[idx]['username']) {
						if (raw_display != '') {
							raw_display = raw_display + ',' ;
						}
						raw_display = raw_display + display[idx]['username'] ;
					}
					if (display[idx]['arn']) {
						if (raw_display != '') {
							raw_display = raw_display + ',' ;
						}
						raw_display = raw_display + display[idx]['arn'] ;
					}
					if (display[idx]['uid']) {
						if (raw_display != '') {
							raw_display = raw_display + ',' ;
						}
						raw_display = raw_display + display[idx]['uid'] ;
					}
					console.log( raw_display ) ;
					raw_display = '' ; //
				} // iterate display
			}
			else {
				console.log( display )
			} // if raw
		} // if err
	} // callback
) // listUsers
