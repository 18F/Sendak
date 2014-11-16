#!/usr/bin/env node

/*

	task to build a node with aws-sdk using runInstances, storing the resulting
	information where Sendak can use it.

*/

var parsed = require( 'sendak-usage' ).parsedown( {
	'ssh-key-name' : {
		'long-args'   : [ 'ssh-key-name' ],
		'description' : 'The ssh key name (not filename) you would use to log into this node with.',
		'type'        : [ String ]
	},
	'security-groups' : {
		'long-args'   : [ 'security-groups' ],
		'description' : 'A security group or several security groups that apply to this node.',
		'type'        : [ String, Array ]
	},
	'subnet' : {
		'long-args'   : [ 'subnet' ],
		'description' : 'The subnet [implies vpc] where this node should reside.',
		'type'        : [ String ]
	},
	'ami-id' : {
		'long-args'   : [ 'ami-id' ],
		'description' : 'The amazon AMI you would have burned onto this node.',
		'type'        : [ String ]
	},
	'instance-type' : {
		'long-args'   : [ 'instance-type' ],
		'description' : 'The type of instance for the node.',
		'type'        : [ String ]
	},
	'protect' : {
		'long-args'   : [ 'protect' ],
		'description' : 'Whether this node should have instance termination protection.',
		'type'        : [ Boolean ]
	},
	'autoburn' : {
		'long-args'   : [ 'autoburn' ],
		'description' : 'Whether this node should be terminated upon launch (useful for "burner" nodes).'
		'type'        : [ Boolean ]
	},
	'help' : {
		'long-args'   : [ 'help' ],
		'description' : 'Halp the user.',
		'type'        : [ Boolean ]
	},
}, process.argv )
	, nopt  = parsed[0],
	, usage = parsed[1];


if (nopt['help']) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

// TODO: Add 'self-destruct-upon-task' flag for constructor

var build_instance = function( args, callback ) { // {{{
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

	// This is just used to generate a noncely thing for nodename
	//
	var t = new Date().getTime() ; var frag = t.toString().substr(-4) ;

	var return_value = {
		hostname          : '',
		public_ip         : '',
		instance_id       : '',
		availability_zone : ''
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
					// XXX: We need to break out of this if we are using dry run, as this will
					// dutifully block synchronously until forever
					//
					ec2.waitFor( 'instanceRunning', { InstanceIds : [ return_value.instance_id ] }, function ( wait_for_err, instance_data ) {
						if (wait_for_err) {
							callback( wait_for_err, wait_for_err.stack );
						}
						else {
							var reservation_zero = instance_data.Reservations[0];
							var instance_zero    = reservation_zero.Instances[0];

							return_value.hostname          = instance_zero.PublicDnsName;
							return_value.public_ip         = instance_zero.PublicIpAddress;
							return_value.availability_zone = instance_zero.Placement.AvailabilityZone;

							// console.log( instance_zero )

							callback( return_value );
						} // if wait_for_err
					} ) // ec2.waitFor
				} // if di_err
			} ) // describeInstances
		} // if ri_err
	} ) // runInstances
} // }}} build_instance

// Load the AWS SDK for Node.js & grab an ec2 interface
//
var AWS = require('aws-sdk');
var ec2 = new AWS.EC2(
	{
		region: 'us-east-1'  // per @mhart at https://github.com/aws/aws-sdk-js/issues/350
	}
);
var rrm = require( 'rrm' );

var this_node = build_instance(
	{
		// TODO: Fix this to use a map from the defaults hash use with nopt, above
		//
		// TODO: autoburn
		//
		// TODO: optionally list associated volumes
		//
		ssh_key_name    : nopt[ 'ssh-key-name' ]    ? nopt[ 'ssh-key-name' ]    : 'jane-fetch-aws-root',
		security_groups : nopt[ 'security-groups' ] ? nopt[ 'security-groups' ] : [ 'sg-d5f1a7b0', 'sg-5ca8f939' ],
		subnet          : nopt[ 'subnet' ]          ? nopt[ 'subnet' ]          : 'subnet-bd4d85ca',

		ami_id          : nopt[ 'ami-id' ]          ? nopt[ 'ami-id' ]          : 'ami-020bc76a',
		instance_type   : nopt[ 'instance-type' ]   ? nopt[ 'instance-type' ]   : 't1.micro',
		protect         : nopt[ 'protect' ]         ? nopt[ 'protect' ]         : false
	},
	function (ec2_result, stack) {
		if (stack) {
			console.log( 'error during node creation: ' + stack );
			process.exit(-255);
		}
		else {
			// So we have successfully created an actual node, but let's get its information and
			// put it in Riak
			//
			var metadata = rrm.new_object( 'Node' );

			metadata['name']              = ec2_result['hostname'];
			metadata['instance_id']       = ec2_result['instance_id'];
			metadata['availability_zone'] = ec2_result['availability_zone'];

			rrm.add_object( 'Node', metadata ).then( function (serial) {
				console.log(
					'Node ' + metadata['instance_id'] + ' created (Riak ID: ' + serial +
					') : ssh ubuntu@' +
					ec2_result['public_ip']
				)
			} )
		}
	} // callback to build_instance
); // this_node = build_instance

