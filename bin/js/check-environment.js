#! /usr/bin/env node
// (very) simple healthchecks for the sendak environment
//

'use strict';

var meta = function () {
	return {
		'args' : {
			'riak'   : [ Boolean, 'check the riak'   ],
			'github' : [ Boolean, 'check the github' ],
			'rrm'    : [ Boolean, 'check the rrm'    ],
			'aws'    : [ Boolean, 'check the aws'    ],

			'all'    : [ Boolean, 'check all things' ],
		},

		'name'     : 'check-environment',
		'abstract' : 'verifies the health of the sendak environment superficially.'
	}
};

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, github = Sendak.github
		, riak   = Sendak.riak
		, rrm    = Sendak.rrm
		, ec2    = Sendak.ec2
		, iam    = Sendak.iam
		, logger = Sendak.getlogger()
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr
		, q      = require( 'q' )

	if (args['help']) {
		// Be halpful
		//
		console.log( 'Usage: ' );
		console.log( usage );
		process.exit(0); // success
	}

	var checks = {
		'riak' : function () {
			logger.debug( 'checking riak status' );
			return riak.ping().then( function (r) { return r } );
		},
		'github' : function () {
			var deferred = q.defer()
				, health   = undefined;

			logger.debug( 'checking github status' );
			// And of course octocat has followers.
			//
			deferred.resolve( health );
			return q.all( function () {
				github.user.getFollowingFromUser( { 'user': 'octocat' }, function (e,r) {
					if (e) { health = false; }
					if (r) { health = true;  }
					return deferred.promise;
				} )
			} );
		},
		'aws' : function () {
			var rvals  = [ undefined, undefined ]
				, deferred = q.defer();

			logger.debug( 'checking aws status' );

			// So, technically, these tests don't prove anything. But we need to have
			// both ec2 and iam access for Sendak to verb any nouns.
			//

			iam.listUsers( { }, function (e, r) {
				if (e) { return false }
				if (r) { rvals[0] = true; return true; }
				return false;
			} )

			ec2.describeRegions( { }, function (e, r) {
				if (e) { return false }
				if (r) { rvals[1] = true; return true; }
				return false;
			} )

			// XXX: This probably does not do what you think it does, Jane.
			//
			deferred.resolve( rvals );

			return deferred.promise;
		},
		'rrm' : function () {
			var deferred = q.defer();

			logger.debug( 'checking rrm status' );

			return q.all( function () {
				return rrm.get_schema().then( function (f) { return f } )
			} );
		}
	};

	Object.keys( checks ).forEach( function (check) {

		if (args[check] || args['all']) {
			checks[check]().then( function (r) {
				if (r) { stdout( 'Check [' + check + '] seems superficially healthy.' ) }
				else   { stderr( 'Failed healthcheck for '.concat( check, '.' ) ) }
			} );
		}
	} );
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
