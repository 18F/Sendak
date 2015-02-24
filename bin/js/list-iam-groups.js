// Note that this only shows the AWS IAM groups at the moment, and that should
// be changed so that it prefers data from the database and adds as-needed
// from IAM.
//
// Note it is assumed you will filter the output from these commands via the
// shell rather than passing expressions and transformations to this tool.
//

'use strict';

var meta = function () {
	return {
		'args' : {
			'groupname'   : [ Boolean, 'Display groupname (e.g., Hubot)', ],
			'create-date' : [ Boolean, 'Display creation date (e.g., 2014-09-18T13:10:52Z)', ],
			'arn'         : [ Boolean, 'Display arns (e.g., arn:aws:iam::155555555553:group/hubot)', ],
			'gid'         : [ Boolean, 'Display gids (e.g., AIXXKLJASDEXEXXASDXXE)', ],
			'raw'         : [ Boolean, 'Just display the records without json (csv)', ]
		},

		'name'     : 'list-iam-groups',
		'abstract' : 'lists groups in iam'
	}
}

// TODO: Clean-up and explain that this transforms IAM data into something
//       that looks more like the Sendak schema
//
var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, iam    = Sendak.iam
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr

	iam.listGroups( { },
		function( err, data ) {
			if (err) {
				stderr( err, err.stack )
			}
			else {
				var groups = data.Groups;
				var sendak_groups = [ ];

				groups.forEach( function (group) {
					sendak_groups.push( {
						'group-name'  : group.GroupName,
						'arn'         : group.Arn,
						'gid'         : group.GroupId,
						'create-date' : group.CreateDate
					} );
				} );

				var display = [ ];
				sendak_groups.forEach( function (group) {
					var record = { };
					if (args['group-name']) {
						record['group-name'] = group['group-name']
					}
					if (args['create-date']) {
						record['create-date'] = group['create-date']
					}
					if (args['arn']) {
						record['arn'] = group['arn']
					}
					if (args['gid']) {
						record['gid'] = group['gid']
					}
					display.push( record )
				} );

				stdout( display )
			} // if err
		} // callback
	) // listgroups
}

module.exports = plug;
plug.meta      = meta;

// jane@cpan.org // vim:tw=80:ts=2:noet
