// add an iam user to an (iam) group
//

'use strict';

var meta = function () {
	return {
		'args' : {
			'user-name': 'the iam user name you wish to operate upon',
			'group-name': 'the iam group name you wish to add an iam user to',
		},

		'abstract' : 'adds an iam user to a group',
		'name'     : 'add-iam-user-to-group'
	}
}

var plug = function (args) {
	var Sendak = require( '../../lib/js/sendak.js' )
		, iam    = Sendak.iam
		, stdout = Sendak.stdout
		, stderr = Sendak.stderr
		, dg     = require( 'deep-grep' )

/*

fetch:~ jane$ aws iam create-group --group-name 'st-test-group'
{
    "Group": {
        "Path": "/",
        "CreateDate": "2015-03-30T18:34:12.147Z",
        "GroupId": "AGPAJW2Q4TY4VTO4MU4LI",
        "Arn": "arn:aws:iam::144433228153:group/st-test-group",
        "GroupName": "st-test-group"
    }
}
fetch:~ jane$ aws iam add-user-to-group --user-name st-janetest --group-name st-test-group
fetch:~ jane$ aws iam list-groups-for-user --user-name st-janetest
{
    "Groups": [
        {
            "Path": "/",
            "CreateDate": "2015-03-30T18:34:12Z",
            "GroupId": "AGPAJW2Q4TY4VTO4MU4LI",
            "Arn": "arn:aws:iam::144433228153:group/st-test-group",
            "GroupName": "st-test-group"
        }
    ]
}
fetch:~ jane$ aws iam remove-user-from-group --user-name st-janetest --group-name st-test-group
fetch:~ jane$

*/

	iam.AddUserToGroup( { 'GroupName': args['group-name'], 'UserName': args['user-name'] },
		function( err, data ) {
			if (err) { stderr( err, err.stack ) }
			else     { var result = data[0]     }
		} // callback
	); // iam.AddUserToGroup
}

module.exports = plug;
plug.meta      = meta;

// @janearc 🐙👾 // jane@cpan.org // vim:tw=80:ts=2:noet
