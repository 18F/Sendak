// Console.log gives us json which is less-parsable for things like shell.
// so because I, Jane, use shell A Whole Lot, I am gifting myself this for
// later.
//

// Return a string of lines which are all the requested keys joined by a comma
//
var display_raw = function ( hash, keys ) {
	// This is the target for concatenated csv rows
	//
	var display = '';

	// This is the current row
	//
	var raw_display = '';

	for (var idx in keys) { // {{{
		if (hash.hasOwnProperty( keys[idx] )) {
			// Only add commas to non-zeroth elements of the record
			//
			if (idx != 0) {
				raw_display = raw_display + ',' + hash[ keys[idx] ];
			}
			else {
				raw_display = raw_display + hash[ keys[idx] ];
			}
			display = display + raw_display;
			raw_display = '' ;
		} // if key exists
	} // iterate display }}}

	return display;
} // display_raw anon function

exports.display_raw = display_raw;


// So this exists because we are losing quotes to the shell. There's a
// corresponding piece of code in sendak.sh that puts them back in, but
// there is some weirdness about how C (I think it's C... it's whoever is
// constructing process.argv for node) is actually processing those arguments,
// *EVEN IF* they are doublequoted. Because, you know, I like spending an hour
// chasing down stupid quotation quirks.
//

/*

The original would look like:

[ 'node',
  '/Users/jane/dev/Sendak/bin/js/riak.js',
  '--tuple',
  '"blah',
  'blah"' ]

And fixed, would look like:

[ 'node',
  '/Users/jane/dev/Sendak/bin/js/riak.js',
  '--tuple',
  '"blah blah"' ]
*/

var fix_quoted_array = function ( arglist ) {
	// nope, this is not working
	//
	process.exit(-255);
	var concat = ''
		, fixt_argv = [];
	
	for (var i in arglist) {
		var argument = arglist[i];
	
		var firstchar = argument.substr(0,1)
			, lastchar  = argument.substr( argument.length - 1, argument.length );
	
		if ( (firstchar == "'" && lastchar == "'") || (firstchar == '"' && lastchar == '"') ) {
			// This is a singular, but quoted argument
			//
			var dequoted = argument.substr(1, argument.length);
			dequoted = dequoted.substr(0, dequoted.length - 1);
			argument = dequoted;
	
			fixt_argv.push( argument );
		}
		else if ((firstchar == '"') || (firstchar == "'")) {
			// This is the beginning of a quoted string in the argument
			//
			var dequoted = argument.substr(1, argument.length);
			concat = dequoted + ' ';
		}
		else if ((lastchar = '"') || (lastchar == "'")) {
			// This is the end of a quoted string in the argument
			//
			var dequoted = argument.substr(0, argument.length - 1);
			concat += ' ' + dequoted;
			fixt_argv.push( concat );
			concat = '';
		}
		else if (concat.length != '') {
			// We're in the middle of concatenating an argument
			//
			concat = ' ' + concat;
		}
		else {
			// logicfail.jpg <3
			//
		}
	}

	return fixt_argv;
}

exports.fix_quoted_array = fix_quoted_array;
