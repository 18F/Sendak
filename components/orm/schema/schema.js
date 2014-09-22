var ORM = {
	Project : { // {{{
		name : {
			isa       : 'string', // varchar(256)?
			defined   : true,     // must be not-null
			distinct  : true      // can be indexed as distinct
		},
		hasmany : [ 'Github_Project', 'User' ]
	}, // }}} project
	Github_Project : { // {{{
		name : {
			isa       : 'string', // 'midas-dev' or similar
			defined   : true,
			distinct  : true
		},
		base_url : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED' // we probably want to check for url-ness of this
		},
		hasmany : [ 'User' ],
		hasone  : [ 'Project' ]
	}, // }}} github_project
	User : { // {{{
		name : {
			isa       : 'string',
			defined   : true,
			distinct  : true
		},
		arn : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED', // is there a way to say "verified by stored procedure"
		},
		amznid : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED',
		},
		hasmany   : [ 'Project', 'Group' ],
	}, // }}} user
	Node : { // {{{
		hasone : [ 'Project', 'GithubProject' ], // must reference a distinct key in these tables
		name : {
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED',
		},
		arn : { // I am thinking this should actually be an object with hooks into aws that also speaks sql.
			isa       : 'string',
			defined   : true,
			distinct  : true,
			verified  : 'RESERVED', // is there a way to say "verified by stored procedure"
		},
	}, // }}} node
} // }}} root

exports.orm = ORM ;
