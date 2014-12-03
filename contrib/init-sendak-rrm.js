#!/usr/bin/env node

var Riak = require( 'riak-dc' );

/*
	http://docs.basho.com/riak/latest/dev/using/basics/

	There is no need to intentionally create buckets in Riak. They pop into
	existence when keys are added to them, and disappear when all keys have
	been removed from them. If you don't specify a bucket's type, the type
	default will be applied.
*/

var schema = {
	'project' : { // {{{
		name : {
			isa       : 'string', // varchar(256)?
			defined   : true,     // must be not-null
			distinct  : true      // can be indexed as distinct
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
			verified  : 'RESERVED' // we probably want to check for url-ness of this
		},
		hasmany : [ 'user' ],
		hasone  : [ 'project' ]
	}, // }}} github_project
	'user' : { // {{{
		name : {
			isa       : 'string',
			defined   : true,
			distinct  : true
		},
		arn : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED', // is there a way to say "verified by stored procedure"
		},
		amznid : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED',
		},
		hasmany   : [ 'project', 'group' ],
	}, // }}} user
	'node' : { // {{{
		hasone : [ 'project', 'github-project' ], // must reference a distinct key in these tables
		name : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED',
		},
		instance_id : { // I am thinking this should actually be an object with hooks into aws that also speaks sql.
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED', // is there a way to say "verified by stored procedure"
		},
		availability_zone : { // sooooo, we can identify instances by their availability zone (which gives us their region) and their instanceid but we can't do it with a single unique identifier like an arn.
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED', // is there a way to say "verified by stored procedure"
		},
	}, // }}} node
}

Object.keys( schema ).forEach( function ( type ) {
	// Walk the schema and put prototypes in the prototypes bucket
	//
	var prototype = schema[ type ];

	console.log( 'prototype object found (' + type + ')' );
	console.log( prototype );

	Riak.put_tuple( 'prototypes', prototype, type ).then( console.log );
} );
