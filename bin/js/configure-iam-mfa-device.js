#!/usr/bin/env node

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
	var Sendak = require( '../../lib/js/sendak.js' )
		, iam    = Sendak.iam
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr

	// This is a placeholder
	//
	iam.createVirtualMfaDevice( {
		// Path                 : // This is the path to the user, I think.
		Path                 : 'arn:aws:iam::144433228153:user/SendakTest',
		// VirtualMfaDeviceName : // this needs to be unique so check what list-mfa-devices shows and replicate
		VirtualMfaDeviceName : 'Sendak-Test-Fake-MFA-1',
		// Outfile              : nopt['output-file']
		Outfile              : 'sendak-qr.png',
		BootstrapMethod      : 'QRCodePNG'
	}, function( err, data ) {
		if (err) {
			stderr( err, err.stack )
		}
		else {

		}
	} ); // createVirtualMfaDevice
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
