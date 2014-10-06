#!/usr/bin/env node
// The stuff that was here in the previous revision is being moved (has been moved)
// to the backend, where it should be.
//

var store = 'var/datastore.json';

if (process.env.SENDAK_DATASTORE) {
	store = process.env.SENDAK_DATASTORE;
}

// Largely cribbed from docs
//
var nopt = require('nopt')
	, noptUsage = require('nopt-usage')
	, knownOpts = {
			'ssh-key-name'    : [ String, null ],
			'security-groups' : [ String, Array, null ],
			'subnet'          : [ String, null ],
			'ami-id'          : [ String, null ],
			'instance-type'   : [ String, null ],
			'protect'         : [ Boolean, null ],
			'autoburn'        : [ Boolean, null ],
			'help'            : [ Boolean, null ]
		}
	, description = {
			'ssh-key-name'    : ' The ssh key name (not filename) you would use to log into this node with.',
			'security-groups' : ' A security group or several security groups that apply to this node.',
			'subnet'          : ' The subnet [implies vpc] where this node should reside.',
			'ami-id'          : ' The amazon AMI you would have burned onto this node.',
			'instance-type'   : ' The type of instance for the node.',
			'protect'         : ' Whether this node should have instance termination protection.',
			'autoburn'        : ' Whether this node should be terminated upon launch (useful for "burner" nodes).',
			'help'            : ' Halp the user.'
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
	, shortHands = {
			'h'          : [ '--help' ]
		}
	, parsed = nopt(knownOpts, process.argv)
	  // defaults, above, can be added to the arguments for noptUsage
	  // but it makes the response unreasonably wide.
	  //
	, usage = noptUsage(knownOpts, shortHands, description)

if (parsed['help']) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

// TODO: Add 'self-destruct-upon-task' flag for constructor

var Sendak = require( 'components/aws/run_instance.js' ); // the ec2 calls live here
var ORM    = require( 'components/odorm/odorm.js' );      // this is our "orm"
var DS     = ORM.restore_schema( store );                 // restore from disk rather than create anew

var this_node = Sendak.new_node(
	{
		// TODO: Fix this to use a map from the defaults hash use with nopt, above
		//
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
			process.exit(-255);
		}
		else {
			// So we have successfully created an actual node, but let's get its information and
			// put it in the datastore
			//
			var metadata = ORM.new_object( 'Node' );
			metadata['name']              = ec2_result['hostname'];
			metadata['instance_id']       = ec2_result['instance_id'];
			metadata['availability_zone'] = ec2_result['availability_zone'];

			ORM.add_object( 'Node', metadata );
			DS = ORM.get_datastore();

			ORM.write_data( store, DS, function (err) {
				if (err) {
					console.log( 'fs.write: ', err.stack );
					process.exit(-255);
				}
				else {
					// was successful so nop
					//
					console.log(
						'Node created (' +
						metadata['instance_id'] +
						') : ssh ubuntu@' +
						ec2_result['public_ip']
					);
					console.log( 'data stored in ' + store );
				}
			} );
		}
	} // callback function
); // new_node()
