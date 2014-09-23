// The stuff that was here in the previous revision is being moved (has been moved)
// to the backend, where it should be.
//

// Largely cribbed from docs
//
var nopt = require('nopt')
	, noptUsage = require('nopt-usage')
	, Stream    = require('stream').Stream
	, path      = require('path')
	, knownOpts = {
			'ssh-key-name'    : [ String, null ],
			'security-groups' : [ String, Array, null ],
			'subnet'          : [ String, null ],
			'ami-id'          : [ String, null ],
			'instance-type'   : [ String, null ],
			'protect'         : [ Boolean, null ],
			'autoburn'        : [ Boolean, null ]
		}
	, description = {
			'ssh-key-name'    : 'The ssh key name (not filename) you would use to log into this node with.',
			'security-groups' : 'A security group or several security groups that apply to this node.',
			'subnet'          : 'The subnet [implies vpc] where this node should reside.',
			'ami-id'          : 'The amazon AMI you would have burned onto this node.',
			'instance-type'   : 'The type of instance for the node.',
			'protect'         : 'Whether this node should have instance termination protection.',
			'autoburn'        : 'Whether this node should be terminated upon launch (useful for "burner" nodes).'
		}
	, defaults = {
			'ssh-key-name'    : 'jane-fetch-aws-root',
			'security-groups' : [ 'sg-d5f1a7b0', 'sg-5ca8f939' ],
			'subnet'          : 'subnet-bd4d85ca',
			'ami-id'          : 'ami-020bc76a',
			'instance-type'   : 't1.micro',
			'protect'         : false,
			'autoburn'        : false
		}
	, shortHands = { }
	, parsed = nopt(knownOpts, process.argv)
	, usage = noptUsage(knownOpts, description, defaults)

// TODO: Add 'self-destruct-upon-task' flag for constructor

var Sendak = require( './components/aws/run_intsance.js' ); // the ec2 calls live here
var ORM    = require( './components/odorm/odorm.js' ); // this is our "orm"

var this_node = Sendak.new_node(
	{
		ssh_key_name    : parsed[ 'ssh-key-name' ]    ? parsed[ 'ssh-key-name' ]    : 'jane-fetch-aws-root',
		security_groups : parsed[ 'security-groups' ] ? parsed[ 'security-groups' ] : [ 'sg-d5f1a7b0', 'sg-5ca8f939' ],
		subnet          : parsed[ 'subnet' ]          ? parsed[ 'subnet' ]          : 'subnet-bd4d85ca',

		ami_id          : parsed[ 'ami-id' ]          ? parsed[ 'ami-id' ]          : 'ami-020bc76a',
		instance_type   : parsed[ 'instance-type' ]   ? parsed[ 'instance-type' ]   : 't1.micro',
		protect         : parsed[ 'protect' ]         ? parsed[ 'protect' ]         : false
		// TODO: autoburn
	},
	function (ec2_result, stack) {
		if (stack) {
			console.log( 'ohnoes: ' + stack );
		}
		else {
			// So we have successfully created an actual node, but let's get its information and
			// put it in the datastore
			//
			var metadata = ORM.new_object( 'Node' );
			metadata['name']              = ec2_result['hostname'];
			metadata['instance_id']       = ec2_result['instance_id'];
			metadata['availability_zone'] = ec2_result['availability_zone'];
			// console.log( metadata );

			ORM.write_data( 'datastore.json', metadata, function (err) {
				console.log( err )
			} );
		}
	} // callback function
); // new_node()
