#!/usr/bin/env node

var t = require( 'components/common/js/task-dispatch.js' );

var task = t.find_task( 'build-node' );

console.log( 'task returned: ' + task );

var params = t.compile_command( {
	'subnet-id'    : 'foo2oikjf',
	'ssh-key-name' : 'jane-fetch-aws-root'
} );

console.log( 'subsequent command is: ' + task + ' ' + params );
