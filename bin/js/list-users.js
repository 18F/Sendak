// Load aws-sdk & iam
//
var AWS = require('aws-sdk');

var iam = new AWS.IAM(
	{
		region: 'us-east-1'  // per @mhart at https://github.com/aws/aws-sdk-js/issues/350
	}
);

iam.listUsers( { },
	function( err, data ) {
		if (err) {
			console.log( err, err.stack )
		}
		else {
			// does iam have a .waitFor?
			// https://github.com/18F/DevOps/blob/master/sendak/components/aws/run_instance.js#L128
			//
			var users = data.Users;

			// understand that this is useless at the moment, and we should be
			// pulling data from the orm and optionally verifying with amazon
			//
			var sendak_users = [ ];
			for (user_index in users) {
				sendak_users.push( {
					username : users[user_index].UserName,
					arn      : users[user_index].Arn,
					uid      : users[user_index].UserId
				} );
			} // for users

			// All we are doing right now is list-users
			//
			console.log( sendak_users );
		} // if err
	} // callback
) // listUsers


