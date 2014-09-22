// The stuff that was here in the previous revision is being moved (has been moved)
// to the backend, where it should be.
//

require( './components/aws/run_instance.js' );

var s = new Sendak(
	{
		ssh_key_name    : 'jane-fetch-aws-root',
		security_groups : [ 'sg-d5f1a7b0', 'sg-5ca8f939' ],
		subnet          : 'subnet-bd4d85ca',
  
		ami_id          : 'ami-020bc76a',
		instance_type   : 't1.micro',
		protect         : false,
	},
	function (rval, stack) {
		if (stack) {
			console.log( 'ohnoes: ' + stack );
		}
		else {
			console.log( rval );
		}
	} // callback function
);
