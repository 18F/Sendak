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
	'help'       : { 'type' : [ Boolean ], 'description' : 'is halpful.' },
	'list-tasks' : { 'type' : [ Boolean ], 'description' : 'List available tasks.' }
}, process.argv )
	, nopt  = parsed[0]
	, usage = parsed[1];

var thx = '💝';

var fs = require( 'fs' );
function is_dir( f ) {  return fs.statSync( f ).isDirectory() }
function is_file( f ) { return fs.statSync( f ).isFile()      }

if (parsed[0].argv.original[0].substr(0, 2) != '--') {
	// So we don't have any additional directives for us specifically, we can
	// assume everything after this point belongs to our childrens.

	var child_task = parsed[0].argv.original.shift()
		, child_args = parsed[0].argv.original

	var tasks   = get_tasks()
		, taskmap = { };

	var jgrep      = require( 'jagrep' )
		, stdhandler = function (buf) { console.log( buf.toString() ) };

	// Do we actually have a task named this?
	//
	if (jgrep.in( tasks[1], child_task )) {
		// One day I will have coalesce or hashslices. Until then, this is "okay."
		//
		for (var idx in tasks[1]) { taskmap[tasks[1][idx]] = tasks[0][idx] }

		// Let somebody know if they care
		//
		default_logger( 'Looks like we found ' + child_task + ' at ' + taskmap[child_task] );

		var child = require( 'child_process' ).spawn( taskmap[child_task], child_args );
		child.stdout.on( 'data', stdhandler );
		child.stderr.on( 'data', stdhandler );
		child.on( 'close', function () { console.log( 'child process exited ' + thx ) } );

	}
	else {
		console.log( 'Sorry, I could not find this task, \'' + child_task + '\'' );
		process.exit( -255 );
	}
}
else if (nopt['help']) {
	console.log( 'Understood commands are:' );
	console.log( usage );
	process.exit(0);
}
else if (nopt['list-tasks']) {
	var tasks = get_tasks()
	console.log( 'Available tasks:' );
	console.log( tasks[1].map( function (t) { return ' * ' + t } ).join( "\n" ) );
}
else {
	console.log( 'Sorry, not sure where you\'re going with that. Try:' );
	console.log( usage );
	process.exit(0);
}

// Traipse through the bin dir, and return binary ('task') names along with
// their associated filename, flattening the directory structure into one
// list.
//
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

// TODO: Replace with log4js
//
function default_logger (s) {
	if (process.env['DEBUG']) {
		console.log(s);
	}
}
