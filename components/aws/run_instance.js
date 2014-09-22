/* 

	function to build a node with aws-sdk using runInstances, export that so the rest of
	Sendak can use it.

*/

// Load the AWS SDK for Node.js & grab an ec2 interface
//
var AWS = require('aws-sdk');
var ec2 = new AWS.EC2(
	{
		region: 'us-east-1'  // per @mhart at https://github.com/aws/aws-sdk-js/issues/350
	}
);

// This is just used to generate a noncely thing for nodename
//
var t = new Date().getTime() ; var frag = t.toString().substr(-4) ;

var Sendak = function( args, callback ) {
	// 'args' should be a dictionary containing
	//   required:
	//   * ssh_key_name (a string, from the aws console; NOT the name of a keyfile on disk)
	//   * security_groups (a list of strings, e.g., 'sg-5ca8f939')
	//   * subnet (a string, e.g., 'subnet-bd4d85ca')
	//
	//   optional:
	//   * ami_id (defaults to ami-020bc76a)
	//   * instance_type ('t1.micro' and similar; defaults to t1.micro)
	//   * protect (termination; true | false, defaults to false)
	//
	// NOTE: Your subnet is associated with a VPC. Accordingly you do not (can not) specify
	// a VPC with this call. However, please ensure that the supplied security group(s) are
	// relevant to the subnet you provide or you will not be able to reach your node. If
	// your call fails, unfortunately all you will get is the error from Amazon. Which is
	// not always helpful.
	//

	// Sendak will return to your callback a dictionary containing the information you 
	// need to talk to your new ec2 node:
	//  * public hostname
	//  * public ip address
	//  * aws ec2 instance id (e.g., 'i-87bd676c')
	//

	var return_value = {
		hostname    : '',
		public_ip   : '',
		instance_id : ''
	};

	// This is the 18f hardened ubuntu image
	//
	var ami_id   = 'ami-020bc76a';
	
	// This is the infrastructure cloud, where Sendak lives.
	//
	var vpc_id   = 'vpc-c03d95a5';
	var hostname = 'sendak-subnode-' + frag;
	
	// console.log( args ); // XXX: broken in references below

	var launch_params = {
		// Required:
		//
		KeyName                           : args.ssh_key_name,

		// Optional:
		//
		ImageId                           : args.ami_id ? args.ami_id : ami_id,
		DisableApiTermination             : args.protect ? args.protect : false,
		InstanceType                      : args.instance_type ? args.instance_type : 't1.micro',

		// Not user-serviceable
		//
		EbsOptimized                      : false,
		InstanceInitiatedShutdownBehavior : 'terminate',
		Monitoring                        : { Enabled : false },
		MinCount                          : 1,
		MaxCount                          : 1,
		Placement                         : { AvailabilityZone : 'us-east-1a' },
		
		// DryRun                            : true,
	
		NetworkInterfaces : [
			{
				// Required
				//
				Groups                          : args.security_groups ? args.security_groups : [ 'sg-d5f1a7b0', 'sg-5ca8f939' ],
				SubnetId                        : args.subnet ? args.subnet : 'subnet-bd4d85ca',

				// Not user-serviceable
				//
				AssociatePublicIpAddress        : true,
				DeleteOnTermination             : true,
				Description                     : hostname + '-public',
				DeviceIndex                     : 0,
				SecondaryPrivateIpAddressCount  : 1
			},
		], // NetworkInterfaces
	
	}; // params for runInstances


	// console.log( launch_params ); // XXX: broken in references below

	ec2.runInstances( launch_params, function(ri_err, data) {
		if (ri_err) {
			callback( ri_err, ri_err.stack );
		}
		else { 

			return_value.instance_id = data.Instances[0].InstanceId;

			// To get the public dns name and public ip address we need to actually make
			// additional calls out to aws as the node "settles down". See "$AMAZON_DERP_DELAY"
			// at https://github.com/avriette/misc/blob/master/joshsz/challenge.sh#L91
			//
			ec2.describeInstances( { InstanceIds : [ return_value.instance_id ] }, function ( di_err, di_data ) {
				if (di_err) {
					callback( di_err, di_err.stack );
				}
				else {
					// XXX: note that this explicitly assumes ONE AND ONLY ONE instance is spun up
					// and accordingly is not "really" asychronous. Whatever. Fix later.
					//
					ec2.waitFor( 'instanceRunning', { InstanceIds : [ return_value.instance_id ] }, function ( wait_for_err, instance_data ) {
						if (wait_for_err) {
							callback( wait_for_err, wait_for_err.stack );
						}
						else {
							var reservation_zero = instance_data.Reservations[0];
							var instance_zero    = reservation_zero.Instances[0];

							return_value.hostname  = instance_zero.PublicDnsName;
							return_value.public_ip = instance_zero.PublicIpAddress;

							callback( return_value );
						} // if wait_for_err
					} ) // ec2.waitFor
				} // if di_err
			} ) // describeInstances
		} // if ri_err
	} ) // runInstances
}; // anonymous Sendak function 


