var odorm;
var schema = { };
var datastore = { };
var _version = '0.1';

var crypto = require('crypto');
var supps  = require('components/common/js/supplemental.js');

// 'schema' should be a hash that includes one hash-per-key (so, it is a hash of hashes)
//
// methods:
//   * new_schema - takes optionally a filename. reads (requires!) the
//     file indicated, constructs a schema from that file, and returns
//     a copy of the schema. this process re-initliases the singleton
//     which serves as your in-memory/on-disk database.
//
//     you will need to call new_schema before you have objects et cetera.
//
//   * add_object - takes a schema, a specified object type, and writes that
//     object into the appropriate field of the schema.
//
//   * object_types - will return a list of bare strings referring to the
//     types of objects you have access to inside your orm.
//
//   * new_object - will return a new object that you specify, providing it's
//     a key in the hash provided by object_types.
//
//   * write_data - provide (filename, callback) and the in-memory datastore
//     (a singleton) will be written to the disk. If the operation fails, your
//     callback will be called from fs.writeFile with corresponding error.
//     out onto disk in json, in a way that can be read back in later;
//     you should assume it works if your callback is not called.
//
module.exports = {
	restore_schema : function (filename) { // {{{
		// Read the datastore off disk.
		//
		// TODO: Probably validation of the schema would be a good thing to have
		//       but should be low priority.
		var ds = require( filename );
		datastore = ds;
		return datastore;
	}, // }}}

	new_schema : function (filename) { // {{{
		if (filename) {
			// Define a new schema
			//
			odorm     = require( filename );
			schema    = odorm.orm;
			datastore = schema;
			var obj_types = supps.get_keys( schema );

			for (var idx in obj_types) {
				// Don't pollute 'schema', which is what we are working off, rather
				// create a new variable and populate that accordingly.
				//
				datastore[ obj_types[idx] ]['data'] = [ ];
			}
			datastore[ '_version' ] = _version;
			return datastore;
		}
		else {
			// This is a request for a clean copy of the schema.
			//
			datastore = schema;
			datastore[ '_version' ] = _version;
			return datastore;
		} // filename
	}, // }}} new_schema()

	update_object : function () { // {{{
		// TODO: writeme
	}, // }}}

	add_object : function( type, object ) { // {{{
		if ( datastore.hasOwnProperty( type )) {
			// This looks like a datastore that has an object of the type we are
			// being asked to commit.
			//
			// TODO: This needs to check for uniqueness of objects
			//
			// TODO: This requires a "delete from store" method
			//
			// TODO: This probably works best with a grep function (which node hasn't)
			//
			// TODO: This seems to include a 'data' field inside individual objects
			//       (cf object tree)
			//
			datastore[ type ]['data'].push( object );
			return datastore;
		}
		else {
			// We don't actually have objects of this type, so error
			//
			return null; // this should actually be an exception?
		}
	}, // }}} add_object()

	del_object : function( type, object ) { // {{{
	// {"name":null,"serial":"b72b4624ac4cbf0d7374d88843edc353eba85651e3527e5c990d8e1c50cf8868","instance_id":"i-f7b8de1c","availability_zone":"us-east-1a"}
		var serial = object['serial'];
		var kept = [ ];
		if (datastore.hasOwnProperty( type )) {
			// Looks like we can look at the list of objects of that type in the
			// store
			for (var idx in datastore[type]) {
				// This should be an array of hashes
				//
				record = datastore[type][idx];
				if (record['serial'] != object['serial']) {
					// This means you cannot assume that your datastore is going to
					// always-and-forever have a given order of objects; use the
					// serial attribute to keep track of them.
					//
					kept.push( record );
				}
				else {
					// Ostensibly here we have found an object with the serial indicated
					// and we aren't going to push it. So this is a nop.
					//
				}
			} // for idx
			datastore[type] = kept;
		}
		else {
			// It looks like the user did not actually give us a valid datatype
			//
		}
	}, // }}}

	new_object : function (varname) { // {{{
		if (schema.hasOwnProperty( varname )) {
			// Well, if we have one of those, let's clone it and send the clone back
			// to the user.
			//
			var map   = schema[ varname ];
			var clone = { };

			for (var property in map) { // {{{
				if (
					map.hasOwnProperty( property ) &&
					// Don't map the metadata attributes
					//
					(property != 'hasone') &&
					(property != 'hasmany') &&
					(property != 'data')
				) {
					// Need to create a hash with key property and get a serial for it because
					// this is a new object. XXX: this implies the schema exists somewhere
					// and doesn't need to be created.
					//

					// A "serial" (this should be sufficient for a primary key)
					//
					var nonce = crypto.randomBytes( Math.ceil(32) ).toString('hex');

					// Create the actual hash, casting it to string or integer based on 
					// this gross hack.
					//
					clone[property] = map[property].isa == 'string' ? '' : 0 ;

					clone.serial    = nonce;

					// And here we would need to set methods for gettrs/settrs that would
					// push stuff into the database. XXX: does this mean re-casting clone
					// as a function instead of a hash? How does scoping work on module.exports?
					//
					// clone.gettr_method = 
					// clone.settr_method = 
					//
				} // if it's a key and the right key
			} // walk the hash }}}

			return clone;
		}
		else {
			// We should throw an exception here? Or?
			//
		} // if has property etc
	}, // }}} new_object()

	object_types : function (datastore) { // {{{
		var keys = [ ];
		for (var key in supps.keys(datastore)) {
			// Elements of the schema beginning with '_', like '_version', are
			// reserved. Please don't mess with that.
			//
			if (key.substr(0,1) != '_') {
				keys.push(key);
			}
		}
		return keys;
	}, // }}} object_types()

	get_datastore : function () { // {{{
		return datastore;
	}, // }}} get_datastore()

	write_data : function ( filename, datastore, callback ) { // {{{
		// It would be nice for the objects passed back in new_object were stored
		// in this.stuff (or something) but for now we can just write this and
		// use it as a placeholder
		//
		// TODO: The description for this above is wrong, or the prototype here
		//       is wrong. If datastore is a singleton, it should not be provided
		//       as an argument here.
		//
		var fs = require( 'fs' );
		var pass = JSON.stringify( datastore );

		// Basically if callback never gets called, you can assume fs did its job.
		//
		fs.writeFile( filename, pass, callback );
	} // }}} write_data()
}; // exports
