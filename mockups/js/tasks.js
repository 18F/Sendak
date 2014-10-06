#!/usr/bin/env node

var t = require( 'components/common/js/task-dispatch.js' );

var task = t.find_task( 'build-node' );

console.log( task )
