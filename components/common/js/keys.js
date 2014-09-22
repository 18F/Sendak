// There are several places where I am reproducing this code which just
// returns the keys of a dictionary/hash. I got tired of this.
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
