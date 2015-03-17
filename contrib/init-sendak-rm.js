#!/usr/bin/env node

var riak = require( 'riak-dc' );

var schema = {
	'project' : { // {{{
		'name' : {
			isa       : 'string',
			defined   : true,
			distinct  : true
		},
		hasmany : [ 'github-project', 'user' ]
	}, // }}} project
	'github-project' : { // {{{
		'github-project-name' : {
			isa       : 'string', // 'midas-dev' or similar
			defined   : true,
			distinct  : true
		},
		'base-url' : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED'
		},
		hasmany : [ 'user' ],
		hasone  : [ 'project' ]
	}, // }}} github_project
	'user' : { // {{{
		'user-name' : {
			isa       : 'string',
			defined   : true,
			distinct  : true
		},
		'arn' : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED',
		},
		'user-id' : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED',
		},
		'github-id' : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED',
		},
		hasmany   : [ 'project', 'group' ],
	}, // }}} user
	'node' : { // {{{
		hasone : [ 'project', 'github-project' ],
		'user-name' : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED',
		},
		'instance-id' : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED',
		},
		// sooooo, we can identify instances by their availability zone (which gives
		// us their region) and their instanceid but we can't do it with a single
		// unique identifier like an arn.
		//
		'availability-zone' : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED',
		},
	}, // }}} node
}

Object.keys( schema ).forEach( function ( type ) {
	// Walk the schema and put prototypes in the prototypes bucket
	//
	var prototype = schema[ type ];

	console.log( 'prototype object found (' + type + ')' );
	console.log( prototype );

	riak.put_tuple( 'prototypes', prototype, type )
		.then( console.log );
} );
