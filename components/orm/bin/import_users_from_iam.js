/*

	So this will pull all the users from AWS IAM and throw them in a default 18f
	group, 'users'. Nobody should exist in JUST THIS GROUP, and until a
	workaround exists so that users can be brought in to the database cleanly,
	this should be considered XXX: hack.

*/
var orm = require('sequelize') ;

var sequelize = new orm.( 'infdb', 'infdb', '1e72ae149979b3dbc7c347d2053021b2', {
		dialect: 'postgres',
		port: 5432,
	} );

sequelize
	.authenticate()
	.complete( function(err) {
		if (!!err) {
			console.log( 'Failure to authenticate or otherwise connect to database (dsn?) ', err )
		}
		else {
			console.log( 'Database connection successful.' )
		} // if err
	} // callback for complete
); // sequelize.complete

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
					iam_id   : users[user_index].UserId
				} ); // push
			} // for users
			
			sequelize.sync().success( function () {
				User.bulkCreate( sendak_users ).success( function () {
					User.findAll().success( function (all_users) {
						console.log( all_users )
					} ) // success & callback
				} ) // bulk create & callback
			} ) // sync.success & callback
		} // if err
	} // iam listusers callback
) // iam listUsers


/* an 18f user has the following attributes:
		username:     Sequelize.STRING,
		iam_id:       Sequelize.STRING,
*/

