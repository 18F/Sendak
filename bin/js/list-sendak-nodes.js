'use strict';

var meta = function () {
	return {
		'args' : {
			'name'              : [ Boolean, 'display name (production Project node foo)'   ],
			'serial'            : [ Boolean, 'display serial (XUkJrwJvuh0o3OyPPxPeBM4pyrO)' ],
			'instance-id'       : [ Boolean, 'display instance id (i-3f81fcd4)'             ],
			'availability-zone' : [ Boolean, 'display availability zone (us-east-1a)'       ]
		},

		'abstract' : 'lists nodes (instances) Sendak knows about.',
		'name'     : 'list-sendak-nodes'
	}
};

var plug = function (args) {
	var Sendak  = require( '../../lib/js/sendak.js' )
		, stdout  = Sendak.stdout
		, rrm     = Sendak.rrm
		, pnodes  = rrm.get_objects( 'node' )
		, display = [ ]
		, q       = require( 'q' )

	pnodes.then( function (nodes) { nodes.forEach( function (node) {
		var record = { };
		Object.keys( node ).forEach( function (attribute) {
			if (node[attribute]) {
				record[attribute] = node[attribute];
			}
		} );
		display.push( record );
	} ) } );

	stdout( display );
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
