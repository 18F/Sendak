// Load the AWS SDK for Node.js
//
var AWS = require('aws-sdk');

// Correct this as necessary
//
AWS.config.region = 'us-east-1';

// Get all the users and stuff them into the ORM
// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listUsers-property
//

// note - iam is not defined, jane
iam.listUsers( { }, function( err, results ) {
	if (err) {
		console.log( 'well, this is unpleasant.' );
	}
	else {
		// now bring up new User objects and poop them into the database
	}
})
