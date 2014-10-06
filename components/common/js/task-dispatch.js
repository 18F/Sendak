// Sendak abstracts everything into atomic tasks. This allows us to remain
// language-agnostic for future expansion (so I can write new tasks in shell
// or perl or someone else can come along and write in python et cetera) and
// to ease interoperability with e.g., shell, which cannot actually include
// a js library (for example).
//
// A hugely important component of sendak, as part of a healthy devops
// infrastructure, is that it be entirely usable within the shell, from the
// shell, without having to write new tools or interactions in a language
// that the operator is not familiar with. It is assumed that anyone using
// Unix is capable of using the bourne shell. It is not safe to assume that
// all Unix users are capable of writing Python or Perl or Javascript (or,
// really, even want to).
//
// So as a design decision, executing stuff in the language you're already
// writing code in from the shell (with system(), qx{}, and so on) seems
// questionable, it is the best decision for this project in particular.
//
// I do not recommend this for other projects.
//
// jaa 2 oct 2014
//

// search $SENDAK_ROOT/bin for tasks, fail loudly if there is more than one;
// otherwise return the task you found as an absolute path to the executable
//
var find_task = function ( taskname ) { // {{{

	var found_tasks = [ ];
	var found_files = [ ];

	// We need to wrap this synchronously unfortunately
	//
	var find = require('find');

	if (process.env.SENDAK_ROOT) {
		var binpath = process.env.SENDAK_ROOT + '/bin';
		found_files = find.fileSync( /./, binpath );
	}
	else {
		console.log( 'sendak_root needs to be defined in your environment. exiting.' );
		process.exit( -255 );
	} // if sendak_root

	for (var idx in found_files) {
		var file = found_files[idx];
		var path   = require('path');

		// Lop off the path & extension
		//
		var base   = path.basename(file);
		var dotpos = base.indexOf('.');
		var poss   = base.substr( 0, dotpos );

		// Test for whether we want this task
		//
		if ( poss == taskname ) {
			found_tasks.push( file ); // should be /foo/bar/bin/js/task-name.js, not 'task-name'
		}
		else {
			// nop
		}
	} // iterate found_tasks

	if (found_tasks.length > 1) {
		console.log( 'Error in task tree: too many tasks found.', found_tasks );
		process.exit(-255);
	}

	return found_tasks;
} // }}} find_tasks

exports.find_task = find_task;

// Because we are literally taking input and running shell commands from it
// (which is worse than anything ever anywhere), we encapsulate all the logic
// for concatenation here and only here, and provide detainting here.
//
// Presumably this reduces our risk profile.
//
var compile_command = function ( hash ) { // {{{
	var cmd = '';
	var args = Object.keys( hash );
	for (var idx in args) {
		var argname = args[idx];
		cmd = cmd + '--' + argname + ' ' + hash[argname] + ' '; // note: single arguments only
	}
	return cmd;
}; // }}} compile command

exports.compile_command = compile_command;
