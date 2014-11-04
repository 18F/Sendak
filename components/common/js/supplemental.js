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
