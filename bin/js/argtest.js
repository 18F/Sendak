#!/usr/bin/env node

console.log( 'original arguments: ', process.argv );
console.log( 'fixed arguments: ', require( 'components/common/js/supplemental.js' ).fix_quoted_array( process.argv ) );
