#!/usr/bin/env node

var ORM = require( 'components/odorm/odorm.js' ); // ORM


var schema = ORM.new_schema( 'components/odorm/schema.js' );

var metadata = ORM.new_object( 'Node' );

// {"name":null,"serial":"b72b4624ac4cbf0d7374d88843edc353eba85651e3527e5c990d8e1c50cf8868","instance_id":"i-f7b8de1c","availability_zone":"us-east-1a"}

var my_node = ORM.new_object( 'Node' );

my_node['serial']            = 'b72b4624ac4cbf0d7374d88843edc353eba85651e3527e5c990d8e1c50cf8868';
my_node['instance_id']       = 'i-f7b8de1c';
my_node['availability_zone'] = 'us-east-1a';
my_node['name']              = 'first_node';
var r = ORM.add_object( 'Node', my_node )
if (r) {
	console.log( 'Success.' );
	console.log( r );
}
else {
	console.log( 'Failed to write Node ID ' + my_node['instance_id'] + ' to ORM' );
}

var ds = ORM.get_datastore();

ORM.write_data(
	process.env.SENDAK_DATASTORE ? process.env.SENDAK_DATASTORE : 'datastore.json',
	ds,
	function (stack) { console.log( stack ) }
);
