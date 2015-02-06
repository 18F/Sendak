#! /usr/bin/env node
// (very) simple healthchecks for the sendak environment
//

"use strict";


var parsed = require( 'sendak-usage' ).parsedown( {
	'riak'   : { 'type' : [ Boolean ], 'description' : 'check the riak'   },
	'github' : { 'type' : [ Boolean ], 'description' : 'check the github' },
	'rrm'    : { 'type' : [ Boolean ], 'description' : 'check the rrm'    },
	'aws'    : { 'type' : [ Boolean ], 'description' : 'check the aws'    },

	'all'    : { 'type' : [ Boolean ], 'description' : 'check all things' },

	'help'   : { 'type' : [ Boolean ], 'description': 'halps for users.'  }
}, process.argv )
	, nopt  = parsed[0]
	, usage = parsed[1];

var Sendak = require( '../../lib/js/sendak.js' )
	, github = Sendak.github
	, riak   = Sendak.riak
	, ec2    = Sendak.ec2
	, iam    = Sendak.iam


if (nopt['help']) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

var checks = {
	'riak' : function () {
		return riak.ping().then( function (r) { return r } );
	},
	'github' : function () {
		var q        = require('q')
			, deferred = q.defer()
			, health   = undefined;

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
			, q      = require('q')

		var deferred = q.defer();

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
		// This is not a very useful test.
		//
		var q        = require( 'q' )
			, deferred = q.defer();

		return q.all( function () {
			return rrm.get_schema().then( function (f) { return f } )
		} );
	}
};

Object.keys( checks ).forEach( function (check) {

	if (nopt[check] || nopt['all']) {
		checks[check]().then( function (r) {
			if (r) { console.log( 'Check [' + check + '] seems superficially healthy.' ) }
			else { console.log( 'Failed healthcheck for ' + check + '.' ) }
		} );
	}
} );
