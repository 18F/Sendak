#!/usr/bin/env node

"use strict";

var AWS      = require( 'aws-sdk' )
	, dg       = require( 'deep-grep' )
	, iam      = new AWS.IAM( { region: process.env.AWS_REGION })
	, rrm      = require( 'rrm' )
	, fs       = require( 'fs' )
	, parsed   = require( 'sendak-usage' ).parsedown( {
		'dont'   : { 'type' : [ Boolean ], 'description' : 'don\'t actually do this thing.' },
		'help'   : { 'type' : [ Boolean ], 'description' : 'Halp the user.' }
} , process.argv )
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

if (nopt['help']) { console.log(  usage ); process.exit(0); }

iam.listUsers( { },
	function( err, data ) {
		if (err) {
			console.log( err, err.stack )
		}
		else {
			data.Users.forEach( function (user) { // {{{
				if (!excludes[user.UserName]) {
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
	var nothing_found = true;
	var found;

	var name_struct = function (gn, sn, ac) {
		// If you wanted to l10n this you could make it return something like
		// ARC Jane vs Jane Arc and so on. Or add honorifics.
		//
		return {
			'first': gn,
			'last' : sn,
			'name' : gn + ' ' + sn,
			'acct' : ac
		}
	}

	var regexen = [ // {{{
		// JMArc
		//
		[ /^[A-Z]{3}[a-z]+$/, function (n) { return new name_struct(n.substr(0,2), n.substr(2, n.length), n) } ],

		// CruellaDeVille, CruellaDeLaVille
		//
		[ /^([A-Z][a-z]+)([^AEIOU][aeiou][^aeiou]?)([^AEIOU][aeiou][^aeiou]?)?([A-Z][a-z]+)$/, function (n) {
			var name_parts = n.match( /^([A-Z][a-z]+)([^AEIOU][aeiou][^aeiou]?)([^AEIOU][aeiou][^aeiou]?)?([A-Z][a-z]+)$/ );
			// This is the name we were passed
			//
			var orig  = name_parts.shift();

			// This is the given name, Cruella
			//
			var given = name_parts.shift();

			// This is to become the surname with fragment
			//
			var restructd = '';

			// Take apart the regex
			//
			while (name_parts.length) {
				var sur_trunc = name_parts.pop();
				// And put it together back to front
				//
				if (sur_trunc != undefined) {
					restructd = sur_trunc + restructd;
					// restructd = [ sur_trunc, restructd ].join(' ');
				}
			}

			// Send it back to caller
			//
			return new name_struct( given, restructd, orig );
		} ],
	]; // }}}

	while (nothing_found && (found == undefined)) {
		regexen.forEach( function (r) {
			var re     = r.shift()
				, parser = r.pop();

			if (new RegExp( re ).test( name )) {
				// console.log( name + ' is truthy against ' + re );
				found = parser( name );
				nouthing_found = false;
			}
		} );
	}
	return found;
}
