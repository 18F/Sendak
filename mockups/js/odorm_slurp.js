#!/usr/bin/env node

var ORM = require( 'components/odorm/odorm.js' ); // ORM

var schema = ORM.restore_schema( 'var/datastore.json' );

var nodes = schema['Node']['data'];

console.log( nodes );
