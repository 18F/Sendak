#!/usr/bin/env node
// List the Sendak nodes in the (od)ORM.
//

var store = 'var/datastore.json';

if (process.env.SENDAK_DATASTORE) {
	store = process.env.SENDAK_DATASTORE;
}

var ORM = require( 'components/odorm/odorm.js' ); // ORM

var schema = ORM.restore_schema( store );

var nodes = ORM.get_objects( 'Node' );

console.log(nodes);
