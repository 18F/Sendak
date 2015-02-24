'use strict';

var meta = function () {
	return {
		'args' : {
			'dont' : [ Boolean, 'don\'t actually do this thing.' ],
		},

		'abstract' : 'Take AWS IAM users and create \'accounts\' for them in Sendak\'s rm',
		'name'     : 'coalesce-iam-users'
	}
}

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, rm     = Sendak.rm
		, iam    = Sendak.iam
		, stdout = Sendak.stdout
		, logger = Sendak.getlogger()
		, fs       = require( 'fs' )
		, susers   = [ ]
		, excludes = { }

	// TODO: Put this in Sendak.cf
	//
	if (fs.existsSync( 'etc/excludes.json' )) {
		JSON.parse( fs.readFileSync( 'etc/excludes.json' ).toString() )
			.forEach( function (user) {
				excludes[ user ] = true;
			} )
	}

	function name_split ( name ) { // {{{
		var nothing_found = true;
		var found;

		var name_struct = function (gn, sn, ac) { // {{{
			// If you wanted to l10n this you could make it return something like
			// ARC Jane vs Jane Arc and so on. Or add honorifics.
			//
			return {
				'first': gn,
				'last' : sn,
				'name' : gn + ' ' + sn,
				'acct' : ac
			}
		} // }}}

		var surname_w_articles = /^([A-Z][a-z]+)([CDFLS][aeiou]+[^aeiou]?)([CDFLS][aeiou]+[^aeiou]?)?([A-Z][a-z]+)$/
			, simple_concat      = /^([A-Z][a-z]+)([A-Z][a-z]+)$/
			, initialised        = /^([A-Z]{2,3})([A-Z][a-z]+)$/

		var regexen = [ // {{{
			// JaneArc
			//
			[ simple_concat, function (n) {
				var name_parts = n.match( simple_concat );
				return new name_struct( name_parts[1], name_parts[2], n );
			} ],

			// JMArc
			//
			[ initialised, function (n) { return new name_struct(n.substr(0,2), n.substr(2, n.length), n) } ],

			// CruellaDeVille, CruellaDeLaVille
			//
			[ surname_w_articles, function (n) {
				var name_parts = n.match( surname_w_articles );
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

		regexen.forEach( function (r) {
			var re     = r[0]
				, parser = r[1]

			if ((found == undefined) && new RegExp( re ).test( name )) {
				found = parser( name );
				nothing_found = false;
			}
		} );

		if (found == undefined) {
			// Looks like we walked the regexes and we did not find one suitable.
			//   singletear.swf
			//
			found = new Error( 'Software is hard. ' + name + ' could not be parsed. Sorry.' );
		}
		else {
			logger.debug( 'successfully parsed '.concat(name, ' into ', found.name ) );
		}

		return found;
	} // }}}

	iam.listUsers( { },
		function( err, data ) {
			if (err) {
				console.log( err, err.stack )
			}
			else {
				data.Users.forEach( function (user) { // {{{
					if (!excludes[user.UserName]) {
						var suser = rm.new_object( 'user' );
						suser['user-name'] = user.UserName;
						suser['arn']       = user.Arn;
						suser['user-id']   = user.UserId;

						suser['name']      =  name_split( suser['user-name'] );

						susers.push( suser );
					}
				} ); // }}} iam.listUsers.Users.forEach
			} // if err
			if (args['dont']) {
				// TODO: Logging facility
				console.log( JSON.stringify( susers, null, 2 ) );
			}
			else {
				susers.forEach( function (user) {
					rm.add_object( 'user', user ).then( function (s) {
						console.log( user.name.name + ' object stored with serial ' + s );
					} );
				} );
			}
		} // callback from listUsers
	) // listUsers
}


module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
