#!/usr/bin/env node

/*
  This tool goes and grabs the prototype for 'User' from Riak, and inserts
  the values for this user supplied on the commandline.

  If correct flags are specified, this Sendak user will also be given a
  new account in AWS. These flags are (probably):

  --create-iam-user
  --with-vpc
  --user-name

*/

//   User: '{"name":{"isa":"string","defined":true,"distinct":true},"arn":{"isa":"string","defined":true,"distinct":true,"verified":"RESERVED"},"amznid":{"isa":"string","defined":true,"distinct":true,"verified":"RESERVED"},"hasmany":["Project","Group"]}',


// parse opts
//
var parsed = require( 'sendak-usage' ).parsedown( {
	'create-iam-user' : {
		'type'        : [ Boolean ],
		'description' : 'Specify that you would like an IAM user created.',
		'long-args'   : [ 'create-iam-user' ]
	},
	'with-vpc' : {
		'type'        : [ String ],
		'description' : 'Specify a VPC to which this user should have access.',
		'long-args'   : [ 'with-vpc' ]
	},
	'user-name' : {
		'type'        : [ String ],
		'description' : 'Specify the username',
		'long-args'   : [ 'user-name' ]
	},
	'name' : {
		'description' : 'Specify the person\'s (given, sur) name',
		'type'        : [ String ],
		'long-args'   : [ 'name' ]
	},
	'dry-run' : {
		'type'        : [ Boolean ],
		'description' : 'don\'t actually do it.',
		'long-args'   : [ 'dry-run' ]
	}
}, process.argv )
	, nopt  = parsed[0]
	, usage = parsed[1];

if (nopt['help']) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

var rrm = require( 'rrm' );

if (nopt['user-name']) {
	var puser = rrm.new_object( 'User' );

	puser.then( function (user) {
		// Once we have the prototype for a user...
		// { name: '', arn: '', amznid: '' }

		// This is a placeholder for now. The object has to change a bit.
		//
		user['user-name'] = nopt['user-name'];
		if (! nopt['dry-run']) {
			var pserial = rrm.add_object( 'User', user );
		}

		console.log( 'User object to create: ', user )

		// So some kind of display formatting would go here.
		//
		pserial.then( function (serial) {
			console.log( 'Serial returned ' + serial );
		} );

	} ); // promise of user
}
else {
	console.log( 'You need to provide a user name.' );
	process.exit( -255 );
}
