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

// RETRIEVING USERS // {{{

// get all the users in iam
//
function get_iam_users (args) {
	// args can contain keys:
	//
	//   pattern   : string/regexp
	//   user-name : the aws user name ('JaneArc')
	//   arn       : the aws ARN
	//   user-id   : the aws userid
	//   cached    : just use the cache rather than calling out to IAM
}

// get all the users in a github organisation
//
function get_github_users (args) {
	// args can contain keys:
	//
	//   pattern   : string/regexp
	//   user-name : the github username (janearc), omit any leading '@'
	//   cached    : just use the cache rather than calling out to github
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

function cfg_iam_mfa_device (args) {
	// args can contain keys:
	//
	//   arn       : the aws ARN
	//   dev-name  : the name you wish to give the MFA device
	//   method    : 'string' or 'png' [ Base32StringSeed, QRCodePNG ]
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
