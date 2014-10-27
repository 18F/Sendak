var rrm;
var Schema = { };

var supps  = require('components/common/js/supplemental.js');
var Riak   = require('components/common/js/riak-dc.js');
var q      = require('q');

var promise_err_handler = function (err) {
	console.log( 'promise rejected: ' + err );
}

// XXX: in progress
// reference: https://github.com/18F/Sendak/issues/20

// methods: # {{{
//   * get_schema - returns a hash of objects and their definitions from Riak
//
//   * update_object - given a serial, will 'update' this object in Riak (which
//     amounts to a delete & re-insert operation, so consistency may vary).
//
//   * add_object - takes a schema, a specified object type, and writes that
//     object into the appropriate field of the schema.
//
//   * del_object - given a serial, will remove an object from Riak.
//
//   * new_object - will return a new object that you specify, providing it's
//     a key in the hash provided by object_types.
//
//   * object_types - will return a list of bare strings referring to the
//     types of objects you have access to inside your orm.
//
//   * get_objects - will return an array of the objects associated with a given
//     object type.
// # }}}

module.exports = {
	get_schema : function () { // {{{
		// Returns a (promise of a) hash of what the objects look like in Riak
		//
		var map;
		var deferred = q.defer();

		Riak.get_keys( 'prototypes' )
			.then( function (prototypes) {
				debugger;
				map = { };
				prototypes.forEach( function (prototype) {
					Riak.get_tuple( 'prototypes', prototype ).then( function ( rp ) {
						console.log( 'tuple gotten: ', rp );
						map[ prototype ] = rp;
					}, promise_err_handler );
					debugger;
					deferred.resolve( map[ prototype ] );
				} );
			}, promise_err_handler  );

    return q.Promise(function(resolve, reject, notify) {
			console.log( 'inside q' );
			resolve( map );
			reject( 'failed in q' );
			notify( 'notified' );
		} );

		return deferred.promise;
	}, // }}} get_schema()

	update_object : function () { // {{{
		// Takes an object and a serial, updates Riak to change that object
		//
		// TODO: writeme
	}, // }}}

	add_object : function( type, object ) { // {{{
		if ( Schema.hasOwnProperty( type )) {
			// This looks like a Schema that has an object of the type we are
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
			Schema[ type ]['data'].push( object );
			return Schema;
		}
		else {
			// We don't actually have objects of this type, so error
			//
			return null; // this should actually be an exception?
		}
	}, // }}} add_object()

	del_object : function( type, object ) { // {{{
	/*

fetch:Sendak jane$ sendak riak --list-keys --bucket testing
[ 'NOqTG7wEamiR0FTGFSLpSt5jstq',
  'ClQSSGNdaEVDiPyNYykPe6OQvhs',

...

	*/
		var serial = object['serial'];
		var kept = [ ];
		if (Schema.hasOwnProperty( type )) {
			// Looks like we can look at the list of objects of that type in the
			// store
			for (var idx in Schema[type]) {
				// This should be an array of hashes
				//
				record = Schema[type][idx];
				if (record['serial'] != object['serial']) {
					// This means you cannot assume that your Schema is going to
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
			Schema[type] = kept;
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

	object_types : function () { // {{{
		var keys = [ ];
		for (var key in Object.keys(Schema)) {
			// Elements of the schema beginning with '_', like '_version', are
			// reserved. Please don't mess with that.
			//
			var thiskey = Object.keys(Schema)[ key ];
			if (thiskey.substr(0,1) != '_') {
				keys.push(thiskey);
			}
		}
		return keys;
	}, // }}} object_types()

	get_objects : function (type) { // {{{
		// These two are sanity checks and shouldn't *strictly* be necessary, but
		// don't hurt neither.
		//
		if (schema.hasOwnProperty( type )) {
			if (Schema.hasOwnProperty( type )) {
				var data = Schema[type]['data'];
				if (data) {
					// Also a sanity check; this should *always* be defined, buuuuut
					//
					return data;
				}
				else {
					// If you ask for data and there isn't any, I'm going to give you
					// something that looks like nothing. Rather than return something
					// that might break your code.
					//
					return [ ];
				}
			}
		}
	}, // }}}

}; // exports
