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

exports.display_raw = display_raw;


// There are several places where I am reproducing this code which just
// returns the keys of a dictionary/hash. I got tired of this. Basically
// synonymous with perl's 'keys %foo' function.
//

var get_keys = function ( hash, keys ) {
	var r_keys = [ ];
	for (var key in keys) { // {{{
		if (hash.hasOwnProperty( key )) {
			r_keys.push( key );
		}
	} // iterate hash }}}
	return r_keys;
} // get_keys anon function

exports.get_keys = get_keys
