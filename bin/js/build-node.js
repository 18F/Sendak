'use strict';

/*

	task to build a node with aws-sdk using runInstances, storing the resulting
	information where Sendak can use it.

*/

var meta = function () {
	return {
		'args' : {
			'ssh-key-name'    : [ String,  'The ssh key name (not filename) you would use to log into this node with.' ],
			'security-groups' : [ String,  'A security group to apply to this node.' ],
			'subnet'          : [ String,  'The subnet [implies vpc] where this node should reside.' ],
			'ami-id'          : [ String,  'The amazon AMI you would have burned onto this node.' ],
			'instance-type'   : [ String,  'The type of instance for the node.' ],
			'protect'         : [ Boolean, 'Whether this node should have instance termination protection.' ]
		},

		'abstract' : 'build nodes in aws',
		'name'     : 'build-node'
	}
}

var build_instance = function( args, callback ) { // {{{
	// 'args' should be a dictionary containing
	//   required:
	//   * ssh_key_name (a string, from the aws console; NOT the name of a keyfile on disk)
	//   * security_groups (a list of strings, e.g., 'sg-5ca8f939')
	//   * subnet (a string, e.g., 'subnet-bd4d85ca')
	//
	//   optional:
	//   * ami_id (defaults to ami-2eee5d46)
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
	var ami_id   = 'ami-2eee5d46';
	
	// This is the infrastructure cloud, where Sendak lives.
	//
	var vpc_id   = 'vpc-c03d95a5';
	var hostname = 'sendak-subnode-'.concat( frag );
	
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

	ec2.runInstances( launch_params, function(ri_err, data) {
		if (ri_err) {
			callback( ri_err, ri_err.stack );
		}
		else {

			return_value.instance_id = data.Instances[0].InstanceId;

			// To get the public dns name and public ip address we need to actually make
			// additional calls out to aws as the node "settles down". See "$AMAZON_DERP_DELAY"
			// at https://github.com/janearc/misc/blob/master/joshsz/challenge.sh#L91
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

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, ec2    = Sendak.ec2
		, rm     = Sendak.rm

	var this_node = build_instance( // {{{
		{
			ssh_key_name    : args[ 'ssh-key-name' ]    ? args[ 'ssh-key-name' ]    : 'jane-fetch-aws-root',
			security_groups : args[ 'security-groups' ] ? args[ 'security-groups' ] : [ 'sg-d5f1a7b0', 'sg-5ca8f939' ],
			subnet          : args[ 'subnet' ]          ? args[ 'subnet' ]          : 'subnet-bd4d85ca',

			ami_id          : args[ 'ami-id' ]          ? args[ 'ami-id' ]          : 'ami-020bc76a',
			instance_type   : args[ 'instance-type' ]   ? args[ 'instance-type' ]   : 't1.micro',
			protect         : args[ 'protect' ]         ? args[ 'protect' ]         : false
		},
		function (ec2_result, stack) {
			if (stack) {
				console.log( 'error during node creation: '.concat( stack ) );
				process.exit(-255);
			}
			else {
				// So we have successfully created an actual node, but let's get its information and
				// put it in Riak
				//
				var metadata = rm.new_object( 'node' );

				metadata['name']              = ec2_result['hostname'];
				metadata['instance-id']       = ec2_result['instance_id'];
				metadata['availability-zone'] = ec2_result['availability_zone'];

				rm.add_object( 'node', metadata ).then( function (serial) {
					console.log(
						'Node ' + metadata['instance-id'] + ' created (Riak ID: ' + serial +
						') : ssh ubuntu@' +
						ec2_result['public_ip']
					)
				} )
			}
		} // callback to build_instance
	); // this_node = build_instance }}}
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
