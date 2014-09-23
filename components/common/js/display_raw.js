// Console.log gives us json which is less-parsable for things like shell.
// so because I, Jane, use shell A Whole Lot, I am gifting myself this for
// later.
//

// Return a string of lines which are all the requested keys joined by a comma
//
var display_raw = function ( hash, keys ) {
	var display = '';
	var raw_display = '';
	for (var key in keys) { // {{{
		// if (hash.hasOwnProperty( key )) {
		if (raw_display != '') {
			raw_display = raw_display + ',' ;
		}
		raw_display = raw_display + hash[key];
		display = raw_display + "\n"
		raw_display = '' ; 
	} // iterate display
	return display;
} // display_raw anon function
