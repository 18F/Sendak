#!/usr/bin/env node

'use strict';

var meta = function () {
	return {
		'args' : {
			'user-name' : [ Boolean, 'Display usernames' ],
			'arn'       : [ Boolean, 'Display arn\'s' ],
			'user-id'   : [ Boolean, 'Display user-id\'s' ],
			'pattern'   : [ String,  'Pattern to match returned data against' ]
		},

		'name'     : 'list-sendak-users',
		'abstract' : 'gives a list of the users in the Sendak metadata repository'
	}
};

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, rrm    = Sendak.rrm
		, stdout = Sendak.stdout
		, dg     = require( 'deep-grep' )

	var results = [ ];

	var pusers = rrm.get_objects( 'user' ).then( function ( users ) {
		users.forEach( function (user) {
			var json = JSON.parse( user );
			var result = { };
			Object.keys( args ).forEach( function (req_key) {
				if (json.hasOwnProperty( req_key )) { result[req_key] = json[req_key] }
			} )
			results.push( result )
		} )
		if (args['pattern']) {
			console.log( dg.deeply(
				results,
				function (k) { if (k.toString().match( args['pattern'] )) { return true } },
				{
					'return-hash-tuples' : true,
					'check-values'       : true,
					'check-keys'         : false
				}
			) )
		}
		else {
			console.log( results );
		}
	} );
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
