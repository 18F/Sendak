#!/usr/bin/env node

// sendak.ps
//   the sendak dispatcher, which lives atop plugsuit

'use strict;'

var plugsuit = require( 'plugsuit' )
	, parsed   = require( 'sendak-usage' ).parsedown( { }, process.argv )
	, usage    = parsed[1]
	, args     = parsed[0];

plugsuit.init( 'bin/js' );
plugsuit.dispatch( process.argv )
