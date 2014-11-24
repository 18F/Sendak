#!/usr/bin/env node

/*

  The Sendak dispatcher. Was originally written in shell; there proved to be
  limitations in passing arguments from shell to child processes because of
  quote interpolation. Additionally, unit testing in the shell is kind of a
  joke.

  So, we have the following from the original:

    Sendak dispatcher. Basically, if you execute:

    $ sendak do-a-thing --with-that-argument foo

    Sendak will look in bin/{js,python,perl,...} for a file named 'do-a-thing'.
    It will error out if it finds more than one file named do-a-thing regardless
    of extension or parent directory (so please keep your things uniquely
    named) and then execute `bin/py/do-a-thing.py` (or whichever language
    do-a-thing is written in) with the args `--with-that-argument foo`.
    Which is to say:

    $ bin/py/do-a-thing.py --with-that-argument foo

    We do this so that certain environment variables can be passed through to
    all of Sendak and that certain assumptions can be made about which things
    are available (for the moment this means basic understanding of what the
    Sendak ORM looks like, which includes AWS IAM data and 18F
    user/group/policy data, among others).

  And the aim with this iteration is to replicate that functionality exactly
  before expanding and adding e.g., unit test hooks and so forth.

*/

var parsed = require( 'sendak-usage' ).parsedown( {
	'help' : {
		'long-args'   : [ 'help' ],
		'description' : 'is halpful.',
		'type'        : [ Boolean ]
	},
	'list-tasks' : {
		'long-args'   : [ 'list-tasks' ],
		'description' : 'List available tasks.',
		'type'        : [ Boolean ]
	}

}, process.argv )
	, nopt  = parsed[0]
	, usage = parsed[1];

var fs = require( 'fs' );
function is_dir( f ) {  return fs.statSync( f ).isDirectory() }
function is_file( f ) { return fs.statSync( f ).isFile()      }

if (nopt['help']) {
	console.log( 'Usage:' );
	console.log( usage );
	process.exit(0);
}
else if (nopt['list-tasks']) {
		var tasks = get_tasks()
		console.log( 'Available tasks:' );
		console.log( tasks[1].map( function (t) { return ' * ' + t } ).join( "\n" ) );
}

function get_tasks () {
	var jgrep    = require( 'jagrep' )
		, dg       = require( 'deep-grep' )
		, cwd      = process.cwd()
		, bindir   = cwd + '/bin'
		, files    = jgrep.sync( { 'function': function (f) { return is_dir(f) } },
				fs.readdirSync( bindir ).map( function (bf) {
					return fs.realpathSync(bindir + '/' + bf)
				}
			) ).map( function (ld) { return fs.readdirSync( ld ).map( function (f) { return ld + '/' + f } )
		} )
		, tasks    = dg.flatten( files )
		, names    = tasks.map( function (f) {
			var parts = f.split( '/' )
				, last  = parts.pop()
				, tn    = last.substr( 0, last.toString().indexOf( '.' ) )

			return tn;
		} )

		return [ tasks, names ];
}
