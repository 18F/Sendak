/**
 * @file sendak dot js
 * @author Jane Arc <jane@cpan.org>
 *
 *  @overview the Sendak back-end contains all the calls necessary to translate
 *  between the various objects/interfaces used by 18F's users: github and AWS,
 *  with the Riak/rm backend to store the metadata/intersection between those
 *  systems, as well as the "policy" or "identity" data.
 *
 *  This functionality is exported in the Sendak object. Hierarchically, there
 *  is a 'users' object, underneath which are 'sendak', 'aws', and 'github'
 *  objects. Their interfaces share the same argument names and taxonomy;
 *  Sendak.users.aws.get takes the same arguments as Sendak.users.github.get,
 *  and provides the same objects (albeit with some additional/fewer fields).
 *
 *  @example
 *    Sendak.users.aws.get( {
 *      'user-name': 'JaneArc',
 *      'arn': true,
 *    } ).then( function (awsuser) {
 *      Sendak.users.sendak.get( {
 *        'arn': awsuser.arn,
 *        'given-name': true,
 *        'surname': true,
 *      } ).then( function (sendakuser) {
 *        Sendak.stdout( ''.concat(
 *          'Hello ',
 *          sendakuser['given-name'],
 *          ' it looks like your arn might be ',
 *          awsuser['arn'],
 *          'and your userid is ',
 *          awsuser['user-id']
 *        ) );
 *      } );
 *    } );
 */

'use strict;'

var cf   = require( '../../etc/_sendak-cf.js' )

	// Riak & rm stuff
	, rm   = require( 'rm' )
	, riak = rm.get_riak_handle()

	// Github stuff
	, gh   = require( 'github' )
	, G = new gh( {
		version  : '3.0.0',
		protocol : 'https',
		timeout  : 5000,
		headers  : { 'user-agent': '18F/Sendak' }
	} )

	// AWS stuff
	, AWS    = require('aws-sdk')
	, iam    = new AWS.IAM( )
	, ec2    = new AWS.EC2( )

	// Other stuff
	, dg     = require( 'deep-grep' )
	, q      = require( 'q' )

if (process.env.GH_TOKEN) {
	G.authenticate( {
		type    : 'oauth',
		token   : process.env.GH_TOKEN
	} )
}
else if (process.env.GH_SECRET) {
	G.authenticate( {
		type    : 'oauth',
		key     : process.env.GH_KEY,
		secret  : process.env.GH_SECRET
	} )
}

// RETRIEVING USERS // {{{

/**
 * @description Get users in iam.
 *
 * @param {Object} args
 * @param {String|RegExp} args.pattern a string or regexp to test the results with
 * @param {String|Boolean} args.user-name the user name you wish to return, or true for all.
 * @param {String|Boolean} args.arn the ARN or true for all.
 * @param {String|Boolean} args.user-id the AWS userid or true for all.
 * @param {Boolean} args.cached boolean, whether to actually check amazon or use cache.
 *
 * @returns {Object} an promised array of objects with the requested fields/members.
 *
 * @example
 * get_iam_users( {
 *   'pattern': '[Jj]ane',
 *   'user-name': true,
 *   'arn': true,
 *   'user-id': true,
 * } ).then( function (users) {
 *   // Your users are here.
 * } );
 */
function get_iam_users (args) { // {{{
	var deferred = q.defer()
		, logger   = cf.getlogger()

	if ((typeof args.pattern) == 'string') {
		args.pattern = new RegExp( args.pattern );
	}

	var mogrify = aws_to_sendak;
	iam.listUsers( { }, // this implicitly gets all the users, and we transform that list later.

		function ( err, data ) {
			if (err) {
				return logger.error( err, err.stack )
			}
			else {
				logger.debug( 'data received from iam (listUsers)' );
				var users = data.Users;
				var iam_users = [ ];

				// Pull the things we care about out of IAM and discard the rest
				//
				users.forEach( function (user) { // {{{
					if (args.pattern) {
						// NOTE: deep-grep issue #18 should clean this up a little
						// XXX:  we should not have knowledge of the keys amazon returns.
						//
						[ 'UserName', 'Arn', 'UserId' ].forEach( function (key) {
							if (args.pattern.test( user[key] )) {
								iam_users.push( mogrify( user ) );
							}
						} );
					}
					else {
						// This is a search with booleans, like 'give me just uid'
						//
						var mog     = mogrify( user )
							, mobject = { };
						Object.keys( args ).forEach( function (arg) {
							if ((typeof args[arg]) == 'boolean') {
								if (args[arg]) {
									mobject[arg] = mog[arg];
								}
							}
						} );
						iam_users.push( mobject );
					}
				} ); // users.forEach }}}
			} // if err
			deferred.resolve( iam_users );
		} // callback
	); // listUsers
	return deferred.promise;
} // }}}

/**
 * @description Get users in github
 *
 * @param {Object} args
 * @param {String|RegExp} args.pattern a string or regexp to test the results with
 * @param {String|Boolean} args.user-name the user name you wish to return, or true for all.
 * @param {String} args.org the github organisation the user(s) belongs to. (required)
 * @param {Boolean} args.cached boolean, whether to actually check amazon or use cache.
 *
 * @returns {Object} an promised array of objects with the requested users.
 *
 * @example
 * get_github_users( {
 *   'pattern': '[Jj]ane',
 *   'user-name': true,
 *   'org': '18F',
 * } ).then( function (users) {
 *   // Your users are here.
 * } );
 */
function get_github_users (args) { // {{{

	var deferred = q.defer()
		, gh_users = [ ]
		, logger   = cf.getlogger();

	logger.debug( 'polling github users' );

	G.orgs.getMembers( {
		org: args.org || '18F',
		// filter: '2fa_disabled',
	} , function (err, users) {
		// TODO: requires mogrify
		if (!err) {
			gh_users = users;
			deferred.resolve( gh_users );
		}
		else {
			gh_users = logger.error( 'Broken promise in get_github_users.' );
		}
	} );

	logger.debug( 'returning promise to user (get-github-users)' );
	return deferred.promise;

} // }}}

/**
 * @description Get users in sendak
 *
 * @param {Object} args
 * @param {String|RegExp} args.pattern a string or regexp to test the results with
 * @param {String|Boolean} args.user-name the user name you wish to return, or true for all.
 * @param {String|Boolean} args.user-id the AWS userid or true for all.
 * @param {String|Boolean} args.given the given name or true for all.
 * @param {String|Boolean} args.surname the surname or true for all.
 * @param {Boolean} args.cached boolean, whether to actually check amazon or use cache.
 *
 * @returns {Object} an promised array of objects with the requested users.
 *
 * @example
 * get_sendak_users( {
 *   'pattern': '[Jj]ane',
 *   'user-name': true,
 *   'user-id': true,
 *   'given': true,
 *   'surname': true,
 * } ).then( function (users) {
 *   // Your users are here.
 * } );
 */
function get_sendak_users (args) { // {{{
	var results = [ ]
		, logger   = cf.getlogger()
		, deferred = q.defer()

	rm.get_objects( 'user' ).then( function ( users ) {
		logger.debug( 'inside promised get_objects' );
		users.forEach( function (user) {
			// Jane, this makes me nervous. Don't do that.
			//
			var json = JSON.parse( user );
			var result = { };
			Object.keys( args ).forEach( function (req_key) {
				if (json.hasOwnProperty( req_key )) { result[req_key] = json[req_key] }
			} )
			results.push( result )
		} ); // users.foreach

		deferred.resolve( results );

		if (args.pattern) {
			// This is not actually what's described in the docstring above. Updating
			// deep-grep should fix it. See dg #18.
			//
			logger.debug( 'performing grep within get_objects' );
			results = dg.deeply(
				results,
				function (k) { if (k.toString().match( args.pattern )) { return true } },
				{
					'return-hash-tuples' : true,
					'check-values'       : true,
					'check-keys'         : false
				}
			);
		} // if pattern
		else {
			// There's no pattern requested, just push the user
			//
			results.push( user );
		}
	} ); // rm.get_objects
	return deferred.promise;
} // }}}

// RETRIEVING USERS // }}}

// CREATING USERS // {{{

/**
 * @description Create a Sendak user
 *
 * @param {Object} args
 * @param {String} args.user-name the (AWS) username for the user (e.g., JaneArc)
 * @param {String} args.name the user's (given, sur) name
 * @param {String} args.github-id the user's github account id (e.g., janearc)
 * @param {String} args.arn the user's ARN (e.g.,arn:aws:iam::555555555555:user/JaneArc)
 *
 * @returns {Object} an promise to a Sendak user object
 * @see {@link https://github.com/18F/Sendak/blob/master/contrib/init-sendak-rm.js#L14|Sendak Schema}
 */
function create_sendak_user (args) { // {{{
	var deferred = q.defer()
		, logger   = cf.getlogger()
		, ruser    = { }
	rm.new_object( 'user' ).then( function (user) {
		logger.debug( 'new user object returned (create_sendak_user)' );
		user['user-name'] = args['user-name'];

		rm.add_object( 'user', user ).then( function (serial) {
			user.serial = serial;
			logger.debug( 'Serial returned '.concat( serial, ' (create_sendak_user)' ) );
			ruser = user;
			deferred.resolve( ruser );
		} );

	} ); // promise of user

	return deferred.promise;
} // }}}

/**
 * @description Create an IAM user
 *
 * @param {Object} args
 * @param {String} args.user-name the username for the user (e.g., JaneArc)
 *
 * @returns {Object} an promise to a string containing the ARN of the user
 */
function create_iam_user (args) { // {{{
	// args can contain keys:
	//
	//   user-name : the aws user name ('JaneArc')
	var deferred = q.defer()
		, logger   = cf.getlogger()

/*

{ ResponseMetadata: { RequestId: '3b9a0ed2-bc5d-11e4-997c-81ea887142fd' },
  User:
   { Path: '/',
     UserName: 'st-JaneFoo',
     UserId: 'AIDAIGOS4CSFE7FVW7FYC',
     Arn: 'arn:aws:iam::144433228153:user/st-JaneFoo',
     CreateDate: Tue Feb 24 2015 14:42:14 GMT-0500 (EST) } }

*/

	iam.createUser( {
		'UserName' : 'st-'.concat( args['user-name'] )
	}, function ( err, data ) {
		if (err) {
			deferred.resolve( logger.error( 'Failure to create IAM user : '.concat( err.stack ) ) )
		}
		else {
			deferred.resolve( data );
		}
	} )

	return deferred.promise;
} // }}}

// CREATING USERS }}}

// MANAGING MFA DEVICES // {{{

/**
 * @description Create an IAM MFA device, and attach it to a user
 *
 * @param {Object} args
 * @param {String} args.user-name the user to associate the device with
 *
 * @returns {Object} an promise containing the actual MFA data including seed - you'll need to write this yourself.
 */
function cfg_iam_mfa_device (args) { // {{{
	var deferred = q.defer()
		, logger   = cf.getlogger()
		, un       = args['user-name']

/*

{ '0':
   { ResponseMetadata: { RequestId: 'e3bfe0a8-bc61-11e4-882c-0bd08e6c22d4' },
     VirtualMFADevice:
      { SerialNumber: 'arn:aws:iam::144433228153:mfa/mfa/Sendak-Test-Fake-MFA-1',
        Base32StringSeed: <Buffer 59 56 59 43 4e 54 50 46 57 46 42 4a 47 53 5a 50 51 58 33 54 33 54 35 55 32 57 46 43 56 55 57 48 53 4a 4c 47 42 54 49 4f 4e 46 52 37 42 52 4d 53 53 49 50 ...>,
        QRCodePNG: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 00 fa 00 00 00 fa 08 02 00 00 00 07 8e cd 6a 00 00 05 81 49 44 41 54 78 da ed da 41 92 db 30 10 03 ...> } } }

*/

	iam.createVirtualMFADevice( {
		Path                 : '/mfa/', // it's not clear what amazon wants with this path
		VirtualMFADeviceName : 'Sendak-Test-MFA-'.concat( un ),
		// 'Outfile' and 'BootstrapMethod' are handled by the client, not the backend
	}, function ( err, data ) {
		if (err) {
			deferred.resolve( logger.error( 'Failure to config IAM MFA device : '.concat( err.stack ) ) )
		}
		else {
			deferred.resolve( data );
		}
	} ); // createVirtualMfaDevice

	return deferred.promise;
} // }}}

function github_mfa_device_status (args) { // {{{
	// args can contain keys:
	//
	//   pattern   : string/regexp
	//   user-name : the github username (janearc), omit any leading '@'
} // }}}

// MANAGING MFA DEVICES // }}}

// UTILITY FUNCTIONS // {{{

function ucfirst (word) { // {{{
	var logger = cf.getlogger();

	var chars = word.split( '' );
	chars[0]  = chars[0].toUpperCase();

	return chars.join( '' );
} // }}}

function ucfirst_words (mwords) { // {{{
	var words = mwords.split(' ');
	return words.map( ucfirst ).join( ' ' );
} // }}}

function userid_to_name (name) { // {{{
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

function name_to_userid (given, sur) { // {{{
	var gn   = given.toLowerCase()
		, sn   = sur.toLowerCase();

	return [ ucfirst_words( gn ), ucfirst_words( sn ) ].join( '' );
} // }}}

// UTILITY FUNCTIONS // }}}

// MOGRIFICATION {{{

// https://www.google.com/search?q=define:transmogrify
// this is one-way mogrification.
//

function aws_to_sendak (mog) { // {{{
	return {
		'user-name' : mog.UserName,
		'arn'       : mog.Arn,
		'uid'       : mog.UserId
	}
} // }}}

function aws_mfa_to_sendak (mog) { // {{{
	return {
		contents: mog.VirtualMFADevice.QRCodePNG,
		sn:       mog.VirtualMFADevice.SerialNumber,
		seed:     mog.VirtualMFADevice.Base32StringSeed,
		amznxid:  mog.ResponseMetadata.RequestId
	}
} // }}}

function sendak_to_aws (mog) { // {{{
	return {
		'UserName'  : mog['user-name'],
		'Arn'       : mog['arn'],
		'UserId'    : mog['uid']
	}
} // }}}

// MOGRIFICATION }}}

module.exports = {
	// Config
	getcf:     cf.getcf,

	// Logging
	getlogger: cf.getlogger,

	// Github
	github:    G,

	// Amazon
	ec2:       ec2,
	iam:       iam,

	// Data/Shared state
	riak:      riak,
	rm:        rm,

	// For customised stderr/stdout handling
	stdout:    process.env.DEBUG == 'TRACE' ? debugprint : console.log,
	stderr:    cf.getlogger.warn,

	// User management
	users : {
		sendak : {
			get    : get_sendak_users,
			create : create_sendak_user,
			util : {
				userid_to_name : userid_to_name,
				name_to_userid : name_to_userid,

				ucfirst       : ucfirst,
				ucfirst_words : ucfirst_words
			}
		},

		iam : {
			get    : get_iam_users,
			create : create_iam_user,
			mfa : {
				// get, create
				create : cfg_iam_mfa_device
			}
		},

		github : {
			get : get_github_users
		},

		mogrify : {
			aws_to_sendak     : aws_to_sendak,
			sendak_to_aws     : sendak_to_aws,
			aws_mfa_to_sendak : aws_mfa_to_sendak
		}
	}
}

// NOTHING EXPORTED BELOW THIS LINE
//

function debugprint () {
	var util = require( 'util' );
	console.trace( util.inspect( arguments ) );
}

// @janearc 🐙👾 // jane@cpan.org // vim:tw=80:ts=2:noet
