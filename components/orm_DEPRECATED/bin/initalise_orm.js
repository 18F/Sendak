/*
	THIS WILL DESTROY YOUR ORM IF YOU RUN IT.

	Script to initialise the Sendak ORM in Postgres. You should have a schema/ directory
	that will include appropriate user/role definitions for your fancy postgres.

*/
var Sequelize = require('sequelize')
	, sequelize = new Sequelize( 'infdb', 'infdb', '1e72ae149979b3dbc7c347d2053021b2', {
		dialect: 'postgres',
		port: 5432,
	})

sequelize
	.authenticate()
	.complete( function(err) {
		if (!!err) {
			console.log( 'Failure to authenticate or otherwise connect to database (dsn?) ', err )
		}
		else {
			console.log( 'Database connection successful.' )
		}
	})

// define the 18F Project object
//
var Project = sequelize.define( 'Project',
	{
		// Hi Project, what is your name?
		//
		customername: Sequelize.STRING,
	
		// Probably not relevant since the ORM stores our pkeys 
		// <fingers status="crossed" />
		//
		customerid:   Sequelize.STRING, // a nonce
	
		// Something like
		// Department of Office Furniture Furnishings and Revitalisation Project
		//
		customerdesc: Sequelize.STRING, 
	
		// A point of contact for the customer
		// Jane Avriette, 858-367-7293 or similar. No standard yet.
		//
		customerpoc:  Sequelize.STRING,
	
		// Project.hasMany( User );
		// User.hasOne( Project ); 
		// etc...
	
	//	users: [
	//		// a series of (18f) user objects
	//	],
	
		// "who is the superuser for this group? [an 18f user object]",
		// So, one hopes here that this is actually the pkey for the User object
		// that we're trusting the ORM to create. If not, we can nonce-ify the 
		// users and store it here. Seems redundant though.
		//
		customerroot: Sequelize.STRING, 
	
		// note: from the aws iam arn, we can pull the policy out of iam
		// this is an aws iam arn
		//
		awsgroupid:   Sequelize.STRING, 
	}, // Project object definition
	{
		tableName: '18f_projects',
		timestamps: true
	} // ORM attributes for Project
) // sequelize.define()

// define the 18f User object
//
var User = sequelize.define( 'User',
	{
		// JaneAvriette or similar
		//
		username:     Sequelize.STRING,

		// This is the arn for this user, which I guess differs from the pkey
		// sequelize keeps so there's a sort of cobbian redundancy but eh
		//
		iam_id:       Sequelize.STRING,

		// this should not be needed because of the foo.hasOne('project') idiom
		//
		// group_id:      "a reference to a customer.customerid unique identifier",

	},
	{
		tableName: '18f_users',
		timestamps: true
	} // ORM attributes for User
) // sequelize.define()

// 18f node object description
//
var Node = sequelize.define( 'Node',
	{
		// This would be a pkey, but we trust foo.hasOne('project') ? or 'vpc'? or?
		//
		// group_id:      "a reference to a customer.customerid unique identifier",

		// I am not sure what she meant by this
		//
		// aws_attribs:   "a pointer to the aws object for purposes of attrib accessors", // object

		// Refers to the github project pkey tracked by the orm
		//
		// gh_project:    "a pointer to the github project object", // object

		// note the aws ec2 arn &c can be pulled from aws, the gh attribs from gh
		
		// until this shapes up a bit
		//
		placeholder: Sequelize.STRING
	},
	{
		tableName: '18f_nodes',
		timestamps: true
	} // ORM attributes for Node
) // sequelize.define()

// 18f gh project object description
//
var GH_Project = sequelize.define( 'GH_Project',
	{
		// This would be a pkey, but we trust foo.hasOne('project') ? or 'vpc'? or?
		//
		// group_id:      Sequelize.STRING,

		// This would refer to the actual live object from our github interface
		// so let's keep an eye on this for now, but XXX: not implemented.
		//
		// gh_object:     "a reference to the github object",

		// until this shapes up a bit
		//
		placeholder: Sequelize.STRING
	},
	{
		tableName: '18f_gh_projects',
		timestamps: true
	} // ORM attributes for GH_Project
) // sequelize.define()

// Define relational mappings
//
Project.hasMany( GH_Project )
Project.hasMany( User )
Project.hasMany( Node )

// Database.plop()
//
sequelize
	.sync( { force: true } )
	.complete( function(err) {
		if (!!err) {
			console.log( 'Failure to complete initial sequelize sync', err )
		}
		else {
			console.log( 'Initial sequelize sync complete.' )
		}
	} )
