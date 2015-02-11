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

// get all the users in iam
//
function get_iam_users (args) {
	// args can contain keys:
	//
	//   pattern   : string/regexp
	//   user-name : the aws user name ('JaneArc')
	//   arn       : the aws ARN
	//   user-id   : the aws userid
}

// get all the users in a github organisation
//
function get_github_users (args) {
	// args can contain keys:
	//
	//   pattern   : string/regexp
	//   user-name : the github username (janearc), omit any leading '@'
}

// get all the users in sendak
//
function get_sendak_users (args) {
	// args can contain keys:
	//
	//   pattern   : string/regexp
	//   user-name : the aws user name ('JaneArc')
	//   arn       : the aws ARN
	//   user-id   : the aws userid
	//   given     : the given name of the user ('jane')
	//   surname   : the surname of the user
}

var users = {
	
}

module.exports = {
	
}
