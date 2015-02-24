'use strict';

var meta = function () {
	return {
		'args' : {
			'project-name'        : [ String,  'The ssh key name (not filename) you would use to log into this node with.' ],
			'with-github-project' : [ String,  'The github project name associated with this' ],
			'with-user'           : [ String,  'A security group or several security groups that apply to this node.' ],
			'with-vpc'            : [ String,  'Specify the vpc this project should be associated with' ],
			'create-vpc'          : [ Boolean, 'Create a VPC specifically for this project (this is an IAM call)' ]
		},

		'name'     : 'create-sendak-project',
		'abstract' : 'creates a \'super-project\' or \'parent project\' in Sendak',
		'broken'   : true
	}
};


var plug = function (args) {
	var Sendak   = require( '../../lib/js/sendak.js' )
		, rrm      = Sendak.rrm
		, metadata = rrm.new_object( 'project' )
		, logger   = Sendak.getlogger()
		, stdout   = Sendak.stdout
		, stderr   = Sendak.stderr

	stderr( 'this is not written yet; see notes.' );
}

/*
	Next:
	 * Pull the github projects out of the db
	 * Verify the github project exists. ("grep")
	 * Apply new object if that's successful
*/

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
