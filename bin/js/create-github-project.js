'use strict';

var rrm      = require( 'rrm' );
var metadata = rrm.new_object( 'github-project' );

var meta = function () {
	return {
		'args' : {
			'github-project-name' : [ String, 'What is the name of this github project' ],
			'base-url'            : [ String, 'The url to be used for a `git clone` operation' ]
		},

		'name'     : 'create-github-project',
		'abstract' : 'creates a new record for a project on github in the Sendak rrm'
	}
}

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, rrm    = Sendak.rrm
		, logger = Sendak.getlogger()
		, stdout = Sendak.stdout

	if (args['github-project-name'] && args['base-url']) {
		metadata['github-project-name'] = args['github-project-name'];
		metadata['base-url']            = args['base-url'];
		logger.debug( 'Adding new object to github-project', metadata );
		rrm.add_object( 'github-project', metadata )
		stdout( JSON.stringify(metadata) );
		process.exit(0); // success
	}
	else {
		stdout( 'both github-project-name and base-url must be supplied at invocation thx' );
		process.exit(-255); // nope
	}
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
