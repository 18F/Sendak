#! /usr/bin/env node
// (very) simple healthchecks for the sendak environment
//


var parsed = require( 'sendak-usage' ).parsedown( {
	'riak'   : { 'type' : [ String ] },
	'github' : { 'type' : [ String ] },
	'rrm'    : { 'type' : [ Boolean ] },
	'aws'    : { 'type' : [ Boolean ] },

	'help'   : { 'type' : [ Boolean ], 'description': 'halps for users.' }
}, process.argv )
	, nopt  = parsed[0]
	, usage = parsed[1]

if (nopt['help']) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

var checks = {
	'riak' : function () {
		// This is kind of a cop-out since it assumes that a Riak is on
		// localhost:8098, but we will deal with extra configs later (like
		// process.env.RIAK_HOST or something).
		//
		var R = require( 'riak-dc' );
		return R.ping().then( function (r) { return r } );
	},
	'github' : function () {
		// We might later want to have additional github configs, but
		// GH_TOKEN and GH_SECRET should be set.
		//
		var github = require( 'github' )
			, G = new github( {
			version  : '3.0.0',
			protocol : 'https',
			timeout  : 5000,
			headers  : { 'user-agent': '18F/Sendak' }
		} );

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
		// And of course octocat has followers.
		//
		return G.user.getFollowingFromUser( { 'user': 'octocat' }, function (e,r) {
			if (e) { return false }
			if (r) { return true }
			return false;
		} );
	}
	'aws' : function () {
		var AWS    = require('aws-sdk')
			, region = { region: 'us-east-1' }
			, iam    = new AWS.IAM( region )
			, ec2    = new AWS.EC2( region )
			, rvals  = [ undefined, undefined ]

		deferred = q.defer();

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
		// XXX: rrm has no ping() or anything. Probably best to just check for
		//      rrm.get_object_types() -- which checks for an extant schema.
		//

		// TODO: writeme
	}
};

Object.keys( parsed ).forEach( function (check) {
	if ( check === 'help' ) { return }

	checks[check] = false;

	var deferred = q.defer();
	
} );
