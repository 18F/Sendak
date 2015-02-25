'use strict';

var meta = function () {
	return {
		'args' : {
			'user-name'   : [ String, 'Specify username (e.g., JaneAvriette)' ],
			'output-file' : [ String, 'Where to store the resultant QR code'  ]
		},

		'name'     : 'configure-iam-mfa-device',
		'abstract' : 'configure an MFA device for IAM users (such as during onboarding)'
	}
}

var plug = function (args) {
	var Sendak   = require( '../../lib/js/sendak.js' )
		, iam      = Sendak.iam
		, stdout   = Sendak.stdout
		, stderr   = Sendak.stderr
		, logger   = Sendak.getlogger()
		, fs       = require('fs')
		, q        = require('q')
		, def_mfa  = q.defer()
		, def_file = q.defer()

	Sendak.users.iam.mfa.create( ).then( function (mfadata) {
		def_mfa.resolve( {
			contents: mfadata[0].VirtualMFADevice.QRCodePNG,
			sn:       mfadata[0].VirtualMFADevice.SerialNumber,
			seed:     mfadata[0].VirtualMFADevice.Base32StringSeed,
			amznxid:  mfadata[0].ResponseMetadata.RequestId
		} );
	} );

	def_mfa.promise.then( function (mfadata) {
		fs.write( args['output-file'], mfadata.contents, function  (err, bw, buf) {
			if (err) {
				def_file.resolve( err );
			}
			else if (bw > 0) {
				def_file.resolve( args['output-file'] )
			}
			else {
				def_file.resolve( new Error( 'Failure to write file, unknown failure.' ) )
			}
		} );
	} );

	def_file.promise.then( function (result) {
		if (typeof result == 'error') {
			logger.error( result.toString() );
		}
		else {
			logger.info( 'File written: '.concat( result ) );
		}
	} );
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
