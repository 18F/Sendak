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
var find_tasks = function ( hash, keys ) {
} // find_tasks

exports.find_tasks = find_tasks;

// Because we are literally taking input and running shell commands from it
// (which is worse than anything ever anywhere), we encapsulate all the logic
// for concatenation here and only here, and provide detainting here.
//
// Presumably this reduces our risk profile.
//

var compile_command = function ( hash ) {
} // compile command

exports.compile_command = compile_command;
