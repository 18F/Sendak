#!/usr/bin/env node

// sendak.ps
//   the sendak dispatcher, which lives atop plugsuit

'use strict;'

var plugsuit = require( 'plugsuit' );

plugsuit.init( 'bin/js' );
plugsuit.dispatch( process.argv )
