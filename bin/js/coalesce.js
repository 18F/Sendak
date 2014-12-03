#!/usr/bin/env node

var AWS    = require( 'aws-sdk' )
	, iam    = new AWS.IAM( { region: process.env.AWS_REGION })
	, rrm    = require( 'rrm' )
	, parsed = require( 'sendak-usage' ).parsedown( {
		'dont' : { 'type' : [ Boolean ], 'description' : 'don\'t actually do this thing.' },
		'help' : { 'type' : [ Boolean ], 'description' : 'Halp the user.' }
}, process.argv )
	, nopt   = parsed[0]
	, usage  = parsed[1]
	, susers = [ ]

if (nopt['help']) { console.log( 'Usage: ', usage ); process.exit(0); }

iam.listUsers( { },
	function( err, data ) {
		if (err) {
			console.log( err, err.stack )
		}
		else {
			data.Users.forEach( function (user) { // {{{
				var suser = rrm.new_object( 'user' );
				suser['user-name'] = user.UserName;
				suser['arn']       = user.Arn;
				suser['user-id']   = user.UserId;

				susers.push( suser );
			} ); // }}} iam.listUsers.Users.forEach
		} // if err
		console.log( JSON.stringify( susers ) );
	} // callback from listUsers
) // listUsers
