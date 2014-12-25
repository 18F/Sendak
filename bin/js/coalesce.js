#!/usr/bin/env node

var AWS      = require( 'aws-sdk' )
	, iam      = new AWS.IAM( { region: process.env.AWS_REGION })
	, rrm      = require( 'rrm' )
	, fs       = require( 'fs' )
	, parsed   = require( 'sendak-usage' ).parsedown( {
		'dont'   : { 'type' : [ Boolean ], 'description' : 'don\'t actually do this thing.' },
		'help'   : { 'type' : [ Boolean ], 'description' : 'Halp the user.' }
}, process.argv )
	, nopt     = parsed[0]
	, usage    = parsed[1]
	, susers   = [ ]
	, excludes = { }

if (fs.existsSync( 'etc/excludes.json' )) {
	JSON.parse( fs.readFileSync( 'etc/excludes.json' ).toString() )
		.forEach( function (user) {
			excludes[ user ] = true;
		} )
}

console.log( excludes );

if (nopt['help']) { console.log( 'Usage: ', usage ); process.exit(0); }

iam.listUsers( { },
	function( err, data ) {
		if (err) {
			console.log( err, err.stack )
		}
		else {
			data.Users.forEach( function (user) { // {{{
				if (! excludes[user.UserName]) {
					var suser = rrm.new_object( 'user' );
					suser['user-name'] = user.UserName;
					suser['arn']       = user.Arn;
					suser['user-id']   = user.UserId;

					suser['name']      =  name_split( suser['user-name'] ).name;

					susers.push( suser );
				}
			} ); // }}} iam.listUsers.Users.forEach
		} // if err
		console.log( JSON.stringify( susers, null, 2 ) );
	} // callback from listUsers
) // listUsers

function name_split ( name ) {
	// Note because we have CM, we need to actually index on the last-most
	// capital latter, so:
	//   JMAvriette -> [ 'JM', 'Avriette' ]
	//
	// Also we have names like:
	//   Cruella de Ville / Cruella DeVille / Prince LaFontaine / Prince la Fontaine
	// & so forth.
	//

	var uppercase = /[A-Z]/
		, splode    = name.split( '' )
		, last_idx_char
		, given_name
		, sur_name ;

	for (var index in splode) {
		if (uppercase.test( splode[index] )) { last_idx_char = splode[index] }
	}

	given_name = name.substr( 0, name.lastIndexOf( last_idx_char ) );
	sur_name  = name.substr( name.lastIndexOf( last_idx_char ), name.length )

	return {
		'first': given_name,
		'last' : sur_name,
		'name' : given_name + ' ' + sur_name,
		'acct' : name
	};
}
