/*

Do this. You can thank me later.

# aws sdk node
export AWS_ACCESS_KEY_ID=`grep s_access_key ~/.aws/config | cut -d' ' -f 3`
export AWS_SECRET_ACCESS_KEY=`grep aws_sec ~/.aws/config | cut -d' ' -f 3`

*/


// a quick delete-user request for aws iam via node. not intended to be used in anything but the shell.
// jane avriette, jane@cpan.org
//

// Load the AWS SDK for Node.js
//
var AWS = require('aws-sdk');

// Correct this as necessary
//
AWS.config.region = 'us-east-1';

var iam = new AWS.IAM();

// iam offers us two params, username and path. username is required
// because duh.
var delete_user_params = { 
	UserName: 'jane_test_user'
};

// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteUser-property
iam.deleteGroup( delete_user_params, function( err, delete_user_results ) {
	// This means we didn't get what we wanted back. We can't do much but complain and fail.
	//
	if (err) { 
		console.log( err, err.stack ); 
	}
	
	// Otherwise, good things happened. Sometimes this is going to be bare text. Sometimes
	// it's going to be an object. Sometimes it's going to be URI-encoded data.
	//
	else {

		// if it's a bare string
		//
		console.log( delete_user_results );

		// if it's json
		//
		console.log( "%j", delete_user_results );

		// if it's an encoded json string
		//
		console.log( decodeURIComponent( delete_user_results ) );

	} // succesful result from delete user

} ); // iam.deleteGroup
