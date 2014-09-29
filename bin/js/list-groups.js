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
var nopt = require('nopt')
	, noptUsage = require('nopt-usage')
	, Stream    = require('stream').Stream
	, path      = require('path')
	, knownOpts = {
			'groupname'  : [ Boolean, null ],
			'createdate' : [ Boolean, null ],
			'arn'        : [ Boolean, null ],
			'gid'        : [ Boolean, null ],
			'raw'        : [ Boolean, null ]
		}
	, description = {
			'groupname'  : 'Display groupname (e.g., Hubot)',
			'createdate' : 'Display creation date (e.g., 2014-09-18T13:10:52Z)',
			'arn'        : 'Display arns (e.g., arn:aws:iam::155555555553:group/hubot)',
			'gid'        : 'Display gids (e.g., AIXXKLJASDEXEXXASDXXE)',
			'raw'        : 'Just display the records without json (csv)'
		}
	, defaults = {
			'groupname'  : true,
			'createdate' : false,
			'arn'        : false,
			'gid'        : false,
			'raw'        : false
		}
	, shortHands = { }
	, parsed = nopt(knownOpts, process.argv)
	, usage = noptUsage(knownOpts, description, defaults)

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
					groupname  : groups[idx].GroupName,
					arn        : groups[idx].Arn,
					gid        : groups[idx].GroupId,
					createdate : groups[idx].CreateDate
				} );
			} // for groups }}}

			// Display for the user
			//
			var display = [ ];
			for (var idx in sendak_groups) { // {{{
				var record = { };
				if (parsed['groupname']) {
					record['groupname'] = sendak_groups[idx]['groupname']
				}
				if (parsed['createdate']) {
					record['createdate'] = sendak_groups[idx]['createdate']
				}
				if (parsed['arn']) {
					record['arn'] = sendak_groups[idx]['arn']
				}
				if (parsed['gid']) {
					record['gid'] = sendak_groups[idx]['gid']
				}
				display.push( record )
			} // iterate sendak_groups }}}
			if (parsed['raw']) {
				// TODO: use raw_display() from Sendak.supplemental
				//
				var raw_display = '';
				for (var idx in display) {
					// Construct the raw display, element by element, and give the user
					// (which we assume to be a shell script).
					//
					if (display[idx]['groupname']) {
						if (raw_display != '') {
							raw_display = raw_display + ',' ;
						}
						raw_display = raw_display + display[idx]['groupname'] ;
					}
					if (display[idx]['createdate']) {
						if (raw_display != '') {
							raw_display = raw_display + ',' ;
						}
						raw_display = raw_display + display[idx]['createdate'] ;
					}
					if (display[idx]['arn']) {
						if (raw_display != '') {
							raw_display = raw_display + ',' ;
						}
						raw_display = raw_display + display[idx]['arn'] ;
					}
					if (display[idx]['gid']) {
						if (raw_display != '') {
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
