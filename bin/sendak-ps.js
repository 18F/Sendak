#!/usr/bin/env node

// sendak-ps
//   a plugsuit update to the sendak dispatcher

'use strict;'

var plugsuit = require( 'plugsuit' );

plugsuit.init( 'bin/jsps' );
plugsuit.dispatch( process.argv )
