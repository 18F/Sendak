#! /usr/bin/env node
// Note that this only shows the AWS IAM groups at the moment, and that should
// be changed so that it prefers data from the database and adds as-needed
// from IAM.
//
// Note it is assumed you will filter the output from these commands via the
// shell rather than passing expressions and transformations to this tool.
//


// Load aws-sdk & iam
//
var AWS = require('aws-sdk');

var iam = new AWS.IAM(
	{
		region: 'us-east-1'  // per @mhart at https://github.com/aws/aws-sdk-js/issues/350
	}
);

// parse opts
//
var parsed = require( 'sendak-usage' ).parsedown( {
	'groupname' : {
		'type'        : [ Boolean ],
		'description' : 'Display groupname (e.g., Hubot)',
		'long-args'   : [ 'group-name' ]
	},
	'create-date' : {
		'type'        : [ Boolean ],
		'description' : 'Display creation date (e.g., 2014-09-18T13:10:52Z)',
		'long-args'   : [ 'create-date' ]
	},
	'arn' : {
		'type'        : [ Boolean ],
		'description' : 'Display arns (e.g., arn:aws:iam::155555555553:group/hubot)',
		'long-args'   : [ 'arn' ]
	},
	'gid' : {
		'type'        : [ Boolean ],
		'description' : 'Display gids (e.g., AIXXKLJASDEXEXXASDXXE)',
		'long-args'   : [ 'gid' ]
	},
	'raw' : {
		'type'        : [ Boolean ],
		'description' : 'Just display the records without json (csv)',
		'long-args'   : [ 'raw' ]
	},
	'help' : {
		'long-args'   : [ 'help' ],
		'description' : 'Halp the user.',
		'type'        : [ Boolean ]
	}
}, process.argv )
	, usage = parsed[1]
	, nopt  = parsed[0];

iam.listGroups( { },
	function( err, data ) {
		if (err) {
			console.log( err, err.stack )
		}
		else {
			var groups = data.Groups;
			var sendak_groups = [ ]; // spoiler: these are not really sendak users right now

			// Transform the AWS IAM data into something more
			// machine-and-human-readable.
			//
			// XXX: Since this task was written the schema has changed.
			//
			for (var idx in groups) { // {{{
				sendak_groups.push( {
					'group-name'  : groups[idx].GroupName,
					'arn'         : groups[idx].Arn,
					'gid'         : groups[idx].GroupId,
					'create-date' : groups[idx].CreateDate
				} );
			} // for groups }}}

			// Display for the user
			//
			var display = [ ];
			for (var idx in sendak_groups) { // {{{
				var record = { };
				if (nopt['group-name']) {
					record['group-name'] = sendak_groups[idx]['group-name']
				}
				if (nopt['create-date']) {
					record['create-date'] = sendak_groups[idx]['create-date']
				}
				if (nopt['arn']) {
					record['arn'] = sendak_groups[idx]['arn']
				}
				if (nopt['gid']) {
					record['gid'] = sendak_groups[idx]['gid']
				}
				display.push( record )
			} // iterate sendak_groups }}}
			if (nopt['raw']) {
				// TODO: use raw_display() from Sendak.supplemental
				//
				var raw_display = '';
				for (var idx in display) {
					// Construct the raw display, element by element, and give the user
					// (which we assume to be a shell script).
					//
					if (display[idx]['group-name']) {
						if (raw_display.length) {
							raw_display = raw_display + ',' ;
						}
						raw_display = raw_display + display[idx]['group-name'] ;
					}
					if (display[idx]['create-date']) {
						if (raw_display.length) {
							raw_display = raw_display + ',' ;
						}
						raw_display = raw_display + display[idx]['create-date'] ;
					}
					if (display[idx]['arn']) {
						if (raw_display.length) {
							raw_display = raw_display + ',' ;
						}
						raw_display = raw_display + display[idx]['arn'] ;
					}
					if (display[idx]['gid']) {
						if (raw_display.length) {
							raw_display = raw_display + ',' ;
						}
						raw_display = raw_display + display[idx]['gid'] ;
					}
					console.log( raw_display ) ;
					raw_display = '' ; // for some reason this was not getting de-scoped
				} // iterate display
			}
			else {
				console.log( display )
			} // if raw
		} // if err
	} // callback
) // listgroups
