#! /usr/bin/env node
// Wrapper to proof the display-raw function
//

var sendak_supplemental = require( 'components/common/js/supplemental.js' );

var dict = {
	'wanted_key_a' : 'long value for a',
	'wanted_key_b' : 'long value for b',

	'unwanted_key_a' : 'long value for uwa',
	'unwanted_key_b' : 'long value for uwb'
};

var keynames = sendak_supplemental.get_keys( dict );

// console.log( foo );

var string = sendak_supplemental.display_raw( dict, [ 'wanted_key_a', 'wanted_key_b' ] );

console.log( string );
