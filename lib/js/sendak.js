// sendak.js - import the global environment
//

'use strict;'

var cf   = require( '../../etc/_sendak-cf.js' )

	// Riak & rrm stuff
	, riak = require( 'riak-dc' )
	, rrm  = require( 'rrm' )

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

module.exports = {
	getcf:     cf.getcf,
	getlogger: cf.getlogger,
	github:    G,
	riak:      riak,
	ec2:       ec2,
	iam:       iam,
	stdout:    console.log,
	stderr:    cf.getlogger.warn
}

// jane@cpan.org // vim:tw=80:ts=2:noet
