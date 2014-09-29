#!/usr/bin/env node
// List the Sendak nodes in the (od)ORM.
//

// parse opts
//
var nopt = require('nopt')
	, noptUsage = require('nopt-usage')
	, Stream    = require('stream').Stream
	, path      = require('path')
	, knownOpts = {
			'name'              : [ Boolean, null ],
			'serial'            : [ Boolean, null ],
			'instance-id'       : [ Boolean, null ],
			'availability-zone' : [ Boolean, null ],
			'raw'               : [ Boolean, null ],
			'help'              : [ Boolean, null ]

		}
	, description = {
			'name'              : ' display name (production Project node foo)',
			'serial'            : ' display serial (a7e13e2ead5803c43e9dc1c73259402e2feb47c10aeec55a37c6526c75dd2112)',
			'instance-id'       : ' display instance id (i-3f81fcd4)',
			'availability-zone' : ' display availability zone (us-east-1a)',
			'raw'               : ' display as csv instead of json',
			'help'              : ' Sets the helpful bit.'
		}
	, defaults = {
			'username'   : true,
			'arn'        : true,
			'uid'        : true,
			'raw'        : false
		}
	, shortHands = {
			'h'          : [ '--help' ]
		}
	, parsed = nopt(knownOpts, process.argv)
	, usage = noptUsage(knownOpts, shortHands, description, defaults)

if (parsed['help']) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

var store = 'var/datastore.json';

if (process.env.SENDAK_DATASTORE) {
	store = process.env.SENDAK_DATASTORE;
}

// ORM &c
//
var ORM = require( 'components/odorm/odorm.js' ); // ORM
var schema = ORM.restore_schema( store );

// Supplemental Sendak stuff
//
var supp = require( 'components/common/js/supplemental.js' );

var nodes = ORM.get_objects( 'Node' );

var display = [ ];

for (var idx in nodes) { // {{{
	var record = { };
	if (parsed['name']) {
		record['name'] = nodes[idx]['name']
	}
	if (parsed['serial']) {
		record['serial'] = nodes[idx]['serial']
	}
	if (parsed['instance-id']) {
		record['instance_id'] = nodes[idx]['instance_id']
	}
	if (parsed['availability-zone']) {
		record['availability_zone'] = nodes[idx]['availability_zone']
	}
	display.push( record )
} // iterate nodes }}}
if (parsed['raw']) { // display raw {{{
	// XXX: raw is broken until the keys are normalised with -'s instead of _'s.
	//
	for (var idx in display) {
		var output = supp.display_raw( display[ idx ], supp.get_keys( parsed ) );
		console.log( output ) ;
	} // iterate display
} // }}} display raw
else {
	console.log( display )
} // if raw
