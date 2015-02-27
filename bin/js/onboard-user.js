'use strict';

// per https://github.com/18F/Sendak/issues/87
//
// arguments:
//   required:
//     - given name (jane)
//     - surname    (arc)
//     - project    (devops)
//   optional:
//     - github id  (janearc)
//     - filename you'd like written to (/tmp/foo.png)
//
// returns:
//   a one-time password (json)
//   an iam login id
//   a qr code on disk (a file name)
//

var meta = function () {
	return {
		'args' : {
			'given-name'   : [ String, 'Specify given name (e.g., jane)' ],
			'sur-name'     : [ String, 'Specify surname (e.g., arc)' ],
			'github-id'    : [ String, 'Where to store the resultant QR code'  ]
		},

		'name'     : 'onboard-user',
		'abstract' : 'create a new user with identity in Sendak and an account in IAM'
	}
}

var plug = function (args) {
	var Sendak   = require( '../../lib/js/sendak.js' )
		, iam      = Sendak.iam
		, rm       = Sendak.rm
		, stdout   = Sendak.stdout
		, stderr   = Sendak.stderr
		, logger   = Sendak.getlogger()
		, fs       = require('fs')
		, q        = require('q')
		, dg       = require('deep-grep')
		, xit      = require('xact-id-tiny')
		, nonce    = xit.nonce

		// Promises, promises
		//   https://www.youtube.com/watch?v=H8Q83DPZy6E
		, defs     = {
				arn    : q.defer(),
				mfa    : q.defer(),
				file   : q.defer(),
				serial : q.defer()
			}

		// Get an acceptable username and metadata object for the user
		//
		, username  = Sendak.users.sendak.util.name_to_userid( args['given-name'], args['sur-name'] )
		, pmetadata = rm.new_object( 'user' )

		// Get a list of our users in AWS
		//
		, paws_users = Sendak.users.iam.get( { 'user-name': true } )

	paws_users.then( function (users) {
		var extant = dg.deeply( users, function (t) {
			if (t == username) { return true }
		}, {
			'check-keys':         false,
			'check-values':       true,
			'return-hash-tuples': true
		} );

		if (extant.length) {
			// It looks like this user exists in IAM and we can't proceed.
			//
			logger.error( 'Appears '.concat( username, ' already exists in IAM.' ) );
			logger.error( extant );
			process.exit( -255 );
		}
		else {
			Sendak.users.iam.create( { 'user-name' : username.concat( nonce() ) } ).then( function (response) {
				var awsuser = response.User;

				// Now we have a user from Amazon, grab the metadata from RM, and store
				// it back in the database.
				//
				pmetadata.then( function (metadata) {
					// Did they specify a github id at invocation?
					//
					if (args['github-id']) {
						metadata['github-id'] = args['github-id'];
					}
					// here, we should:
					//   * mogrify awsuser
					//   * dg.coalesce( awsuser, metadata, { 'return-clone': true } );
					//   * Sendak.users.sendak.create( /* the mog */ )
					//
					// sendak keys:
					//   * user-name
					//   * arn
					//   * user-id
					//   * name (an object)
					//   * github-id
					//
					var mog = Sendak.users.mogrify.aws_to_sendak( awsuser );
					Sendak.users.sendak.create( dg.coalesce( mog, metadata, { 'return-clone': true } ) )
						.then( function (user) {
							// Creation of a sendak user was successful, resolve that promise
							//
							defs.serial.resolve( user.serial );
							defs.arn.resolve( mog.arn );
						} )
					} );
			} )
		}
	} );
	defs.serial.promise.then( function (serial) {
		defs.arn.promise.then( function (arn) {
			logger.info( 'hurrah, sendak user with serial '.concat( serial, ' created.' ) );
			logger.info( 'this corresponds to IAM user '.concat( arn ) );
		} );
	} );
}

module.exports = plug;
plug.meta      = meta;

// @janearc 🐙👾 // jane@cpan.org // vim:tw=80:ts=2:noet
