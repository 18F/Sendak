#!/usr/bin/env node

// This is not written right now because the policies are very complicated objects.
//

'use strict';

var meta = function () {
	return {
		'args' : {
			'group-name' : [ String, 'specify the group name you\'re looking for' ]
		},
		'name'     : 'list-iam-group-policies',
		'abstract' : 'list IAM policies for a given group'
	}
};

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, iam    = Sendak.iam
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr

	iam.listGroupPolicies( { GroupName : args['group-name'] },
		function( err, data ) {
			if (err) {
				stderr( err, err.stack )
			}
			else {
				stdout( data )
			}
		}
	);
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
