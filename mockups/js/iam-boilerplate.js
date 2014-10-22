/*

Do this. You can thank me later.

# aws sdk node
export AWS_ACCESS_KEY_ID=`grep s_access_key ~/.aws/config | cut -d' ' -f 3`
export AWS_SECRET_ACCESS_KEY=`grep aws_sec ~/.aws/config | cut -d' ' -f 3`

*/


// words go here. what does this do? how does it work?
// yourname, youraddress@foo
//

// Load the AWS SDK for Node.js
//
var AWS = require('aws-sdk');

// Correct this as necessary
//
AWS.config.region = 'us-east-1';

var iam = new AWS.IAM();

// Please name this something sensible because it tends to get kind of recursive where
// you're calling one function from the return of another function, and it gets tiring to
// track seventy-three variables named params.
//
var iam_call_params = { 

};

// Link to the call name here for easy looking up
// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#an_anchor_goes_here
iam.api_call_name( aws_iam_call_params, function( err, iam_call_name_results ) {
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
		console.log( iam_call_name_results );

		// if it's json
		//
		console.log( "%j", iam_call_name_results );

		// if it's an encoded json string
		//
		console.log( decodeURIComponent( iam_call_name_results ) );

	} // succesful result from iam_call_name

} ); // iam.api_call_name
