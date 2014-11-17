#!/usr/bin/env node
// List the Sendak nodes in the (od)ORM.
//

// parse opts
//
var parsed = require( 'sendak-usage' ).parsedown( {
	'name' : {
		'type'         : [ Boolean ],
		'description'  : 'display name (production Project node foo)',
		'long-args'    : [ 'name' ]
	},
	'serial' : {
		'type'         : [ Boolean ],
		'description'  : 'display serial (a7e13e2ead5803c43e9dc1c73259402e2feb47c10aeec55a37c6526c75dd2112)',
		'long-args'    : [ 'serial' ]
	},
	'instance-id' : {
		'type'         : [ Boolean ],
		'description'  : 'display instance id (i-3f81fcd4)',
		'long-args'    : [ 'instance-id' ]
	},
	'availability-zone' : {
		'type'         : [ Boolean ],
		'description'  : 'display availability zone (us-east-1a)',
		'long-args'    : [ 'availability-zone' ]
	},
	'raw' : {
		'type'         : [ Boolean ],
		'description'  : 'display as csv instead of json',
		'long-args'    : [ 'raw' ]
	},
	'help' : {
		'long-args'   : [ 'help' ],
		'description' : 'Halp the user.',
		'type'        : [ Boolean ]
	}
}, process.argv )
	, nopt  = parsed[0]
	, usage = parsed[1];

if (nopt['help']) {
	// Be halpful
	//
	console.log( 'Usage: ' );
	console.log( usage );
	process.exit(0); // success
}

// ORM &c
//
var rrm = require( 'rrm' );

// Supplemental Sendak stuff
//
var supp = require( 'components/common/js/supplemental.js' );

var nodes = rrm.get_objects( 'Node' );

var display = [ ];

for (var idx in nodes) { // {{{
	var record = { };
	if (nopt['name']) {
		record['name'] = nodes[idx]['name']
	}
	if (nopt['serial']) {
		record['serial'] = nodes[idx]['serial']
	}
	if (nopt['instance-id']) {
		record['instance_id'] = nodes[idx]['instance_id']
	}
	if (nopt['availability-zone']) {
		record['availability_zone'] = nodes[idx]['availability_zone']
	}
	display.push( record )
} // iterate nodes }}}
if (nopt['raw']) { // display raw {{{
	// XXX: raw is broken until the keys are normalised with -'s instead of _'s.
	//
	for (var idx in display) {
		var output = supp.display_raw( display[ idx ], Object.keys( nopt ) );
		console.log( output ) ;
	} // iterate display
} // }}} display raw
else {
	console.log( display )
} // if raw
