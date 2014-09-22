#!/usr/bin/env node

// This is not written right now because the policies are very complicated objects.
//

// Load aws-sdk & iam
//
var AWS = require('aws-sdk');

var iam = new AWS.IAM(
	{
		region: 'us-east-1'  // per @mhart at https://github.com/aws/aws-sdk-js/issues/350
	}
);

iam.listGroupPolicies(
	{
		GroupName : '', // needs to support --group-name, using nopt (npm)
	},
	function( err, data ) {
		if (err) {
			console.log( err, err.stack )
		}
		else {
			console.log( data )
		}
	}
);
