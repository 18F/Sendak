#!/usr/bin/env node

'use strict';

var meta = function () {
	return {
		'args' : {
			'create-iam-user' : [ Boolean, 'Specify that you would like an IAM user created.' ],
			'with-vpc'        : [ String,  'Specify a VPC to which this user should have access.' ],
			'user-name'       : [ String,  'Specify the username' ],
			'name'            : [ String,  'Specify the person\'s (given, sur) name' ],
			'dry-run'         : [ Boolean, 'don\'t actually do it.' ]
		},

		'name'     : 'create-sendak-user',
		'abstract' : 'creates a new user in the Sendak metadata store'
	}
};

/*
  This tool goes and grabs the prototype for 'user' from Riak, and inserts
  the values for this user supplied on the commandline.

  If correct flags are specified, this Sendak user will also be given a
  new account in AWS. These flags are (probably):

  --create-iam-user
  --with-vpc
  --user-name

*/

//   User: '{"name":{"isa":"string","defined":true,"distinct":true},"arn":{"isa":"string","defined":true,"distinct":true,"verified":"RESERVED"},"amznid":{"isa":"string","defined":true,"distinct":true,"verified":"RESERVED"},"hasmany":["Project","Group"]}',

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, rrm    = Sendak.rrm
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr
		, logger = Sendak.getlogger()

	if (args['user-name']) {
		logger.debug( 'attempting to create new user '.concat( args['user-name'] ) );
		Sendak.users.sendak.create( args ).then( function (user) {
			stdout( user );
		} );
	}
	else {
		stderr( 'You need to provide a user name.' );
		process.exit( -255 );
	}
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
