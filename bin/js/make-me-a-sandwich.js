#!/usr/bin/env node

'use strict';

var parsed = require( 'sendak-usage' ).parsedown( {

}, process.argv )
	, usage = parsed[1]
	, nopt  = parsed[0];


