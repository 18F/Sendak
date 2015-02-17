// sendak-users.js - manage users in sendak
//

'use strict;'

var Sendak = require( '../../lib/js/sendak.js' )
	, github = Sendak.github
	, rrm    = Sendak.rrm
	, iam    = Sendak.iam
	, logger = Sendak.getlogger()
	, stdout = Sendak.stdout
	, stderr = Sendak.stderr

	, dg     = require( 'deep-grep' )
	, q      = require( 'q' )

// RETRIEVING USERS // {{{

/**
 * Get users in iam.
 *
 * @param {Object} args
 * @param {String|RegExp} args.pattern a string or regexp to test the results with
 * @param {String|Boolean} args.user-name the user name you wish to return, or true for all.
 * @param {String|Boolean} args.arn the ARN or true for all.
 * @param {String|Boolean} args.user-id the AWS userid or true for all.
 * @param {Boolean} args.cached boolean, whether to actually check amazon or use cache.
 *
 * @returns {Object} an promised array of objects with the requested fields/members.
 */
function get_iam_users (args) { // {{{

	if ((typeof pattern) == 'string') {
		pattern = new RegExp( pattern );
	}

	var mogrify = function (mog) {
		return {
			'user-name' : mog.UserName,
			'arn'       : mog.Arn,
			'uid'       : mog.UserId
		}
	}

	iam.listUsers( { },
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
					if (pattern) {
						// NOTE: deep-grep issue #18 should clean this up a little
						//
						[ 'UserName', 'Arn', 'UserId' ].forEach( function (key) {
							if (pattern.test( user[key] )) {
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
		} // callback
	); // listUsers
} // }}}

/**
 * Get users in github
 *
 * @param {Object} args
 * @param {String|RegExp} args.pattern a string or regexp to test the results with
 * @param {String|Boolean} args.user-name the user name you wish to return, or true for all.
 * @param {String|Boolean} args.org the github organisation the user(s) belongs to. (required)
 * @param {Boolean} args.cached boolean, whether to actually check amazon or use cache.
 *
 * @returns {Object} an promised array of objects with the requested users.
 */
function get_github_users (args) { // {{{

	var deferred = q.defer()
		, gh_users = [ ];

	deferred.resolve( gh_users );

	github.orgs.getMembers( {
		org: '18F',
		// filter: '2fa_disabled',
	} , function (err, users) {
		// TODO: requires mogrify
		if (!err) {
			gh_users = users;
		}
		else {
			gh_users = logger.error( 'Broken promise in get_github_users.' );
		}
	} );

	return deferred.promise;

} // }}}

/**
 * Get users in sendak
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
 */
function get_sendak_users (args) { // {{{
	var results = [ ]
		, deferred = q.defer()

	return rrm.get_objects( 'user' ).then( function ( users ) {
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

		if (args['pattern']) {
			// This is not actually what's described in the docstring above. Updating
			// deep-grep should fix it. See dg #18.
			//
			results = dg.deeply(
				results,
				function (k) { if (k.toString().match( args['pattern'] )) { return true } },
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

		return results;

	} ); // (returning from inside) promise to users
} // }}}

// RETRIEVING USERS // }}}

// CREATING USERS // {{{

// create a new sendak user
//
function create_sendak_user (struct) {
	// args can contain keys:
	//
	//   user-name : the aws user name ('JaneArc')
}

// create a new iam user
//
function create_iam_user (struct) {
	// args can contain keys:
	//
	//   user-name : the aws user name ('JaneArc')
}

// CREATING USERS }}}

// MANAGING MFA DEVICES // {{{

/**
 * Get users in sendak
 *
 * @param {Object} args
 * @param {String} args.arn the ARN (user..) to associate the device with
 * @param {String} args.method either 'string' or 'png' indicating what your return should be
 *
 * @returns {String} an string indicating either the location of your file or the data itself
 */
function cfg_iam_mfa_device (args) {

}

function github_mfa_device_status (args) {
	// args can contain keys:
	//
	//   pattern   : string/regexp
	//   user-name : the github username (janearc), omit any leading '@'
}

// MANAGING MFA DEVICES // }}}

var users = {
	
}

module.exports = {
	
}

// @janearc // jane@cpan.org // vim:tw=80:ts=2:noet
