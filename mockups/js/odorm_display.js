#!/usr/bin/env node

var ORM = require( 'components/odorm/odorm.js' ); // ORM

var schema = ORM.restore_schema( 'var/datastore.json' );

var metadata = ORM.new_object( 'Node' );

console.log( metadata );
