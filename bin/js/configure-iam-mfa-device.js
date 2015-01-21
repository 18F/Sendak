#!/usr/bin/env node

"use strict";

var AWS = require('aws-sdk')
	, iam = new AWS.IAM( { region: 'us-east-1' } );

// parse opts
//
var parsed = require( 'sendak-usage' ).parsedown( {
	'user-name'   : { 'type' : [ String  ], 'description' : 'Specify username (e.g., JaneAvriette)' },
	'help'        : { 'type' : [ Boolean ], 'description' : 'Halp the user.' },
	'output-file' : { 'type' : [ String  ], 'description' : 'Where to store the resultant QR code' }
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
		console.log( err, err.stack )
	}
	else {

	}
} ); // createVirtualMfaDevice
