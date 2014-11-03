var rrm;
var Schema = { "defined": 0 };

var supps  = require('components/common/js/supplemental.js');
var Riak   = require('riak-dc');
var q      = require('q');

var promise_err_handler = function (err) {
	console.log( 'promise rejected: ' + err );
}

// XXX: in progress
// reference: https://github.com/18F/Sendak/issues/20

// exported methods: # {{{
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

function get_schema () { // {{{
	// Returns a (promise of a) hash of what the objects look like in Riak
	// credit to @rla (#node.js, github) for reworking some of this.
	//
	if (Schema['defined']) {
		// Basically memoize the call to get_schema because it takes a while
		//
		// TODO: Strip the schema from superfluous data before returning
		//
		// We offer a promise here despite its definedness for purposes of API consistency
		//
		var deferred = q.defer();
		deferred.resolve( Schema );
		return deferred.promise;
	}

	return Riak.get_keys('prototypes').then( function( prototypes ) {
		var map = { };
		return q.all(
			prototypes.map( function( prototype ) {
				return Riak.get_tuple( 'prototypes', prototype ).then(
					function( rp ) {
						map[prototype] = rp;
					}
				) // get_tuple.then
			} ) // prototypes.map
		) // q.all
	.then( function () {
		Schema = map;
		Schema['defined'] = 1;
		return map;
	} ) // q.all.then
	} ) // get_keys.then
} // }}} get_schema()

function update_object (object)  { // {{{
	// Takes an object and a serial, updates Riak to change that object
	//
	// TODO: writeme
} // }}}

function add_object ( type, object ) { // {{{
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
		var pserial = Riak.put_tuple( type, object );

		return Riak.put_tuple(type, object).then( function( pserial ) {
			return pserial;
		} );
	}
	else {
		// We don't actually have objects of this type, so error
		//
		return null; // this should actually be an exception?
	}
} // }}} add_object()

function del_object ( type, object ) { // {{{
/*

fetch:Sendak jane$ sendak riak --list-keys --bucket testing
[ 'NOqTG7wEamiR0FTGFSLpSt5jstq',
  'ClQSSGNdaEVDiPyNYykPe6OQvhs',

...

*/
	var serial = object['serial']
		, result
		, deferred = q.defer();

	Riak.del_tuple( type, serial ).then( function (result) {
		deferred.resolve( result );
	} );

	return deferred.promise;
} // }}}

// not exported
//
function schema_to_object ( definition ) { // {{{
	var clone = { }
		, map   = JSON.parse(definition);

	Object.keys(map).forEach( function (k, idx, keys) {
		if ( (k != 'hasone') && (k != 'hasmany') ) {
			// Create the actual hash, casting it to string or integer based on
			// this gross hack.
			//
			clone[k] = map[k].isa == 'string' ? '' : 0 ;
		} // if it's a key and the right key
	} ) // walk the hash

	return clone;
} // }}}

function new_object ( type ) { // {{{
	if (Schema.hasOwnProperty( type )) {
		// Well, if we have one of those, let's clone it and send the clone back
		// to the user.
		//
		// XXX: checking to make sure we actually have this, because it will break otherwise
		//
		var clone = schema_to_object( Schema[ type ] );

		// Note that this returned object does not have a serial and will only have one upon
		// being stored in Riak.
		//
		return clone;
	}
	else {
		// It looks like the schema hasn't been populated, so go get it.
		//
		var pschema = get_schema();
		return pschema.then( function (s) {
			var clone = schema_to_object( s[ type ] );
			return clone;
		} ) // return
	} // if has property etc
} // }}} new_object()

function object_types () { // {{{
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
} // }}} object_types()

function get_objects (type) { // {{{
	// If you ask for an object type that Riak doesn't have, for now it's
	// a silent failure rather than an exception. TODO: complain.
	//
	var records = [ ];

	// Repeated from get_schema above
	//
	return Riak.get_keys(type).then( function( objects ) {
		return q.all(
			objects.map( function( object ) {
				 var ptuple = Riak.get_tuple( type, object );
				 var tuple  = ptuple.then(
					function( record ) {
						records.push( record );
					}
				) // get_tuple.then
			} ) // objects.map
		) // q.all
	.then( function () {
		return records;
	} ) // q.all.then
	} ) // get_keys.then
} // }}}

exports.get_objects   = get_objects;
exports.object_types  = object_types;
exports.new_object    = new_object;
exports.add_object    = add_object;
exports.update_object = update_object;
exports.get_schema    = get_schema;
exports.del_object    = del_object;
