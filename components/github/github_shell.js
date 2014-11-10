/*

 Pull a github repository down with git-over-ssh

 to be eventually replaced with api calls with e.g., github-api

*/

var fs = require('fs');

// NOTE: See the Sendak documentation for the require environment variables.
//

var sendak_identity = process.env.SENDAK_IDENTITY ;
var sendak_user     = process.env.SENDAK_USER     ;
var sendak_home     = process.env.SENDAK_HOME     ;
var sendak_dry_run  = process.env.SENDAK_DRY_RUN  ;

function deploy_git( repo, branch ) {
	if (fs.existsSync(sendak_identity) && fs.existsSync(sendak_home)) {
		var ssh_cmd     = 'ssh -i ' + sendak_identity + ' -l ' + sendak_user ;
		var git_cmd     = 'GIT_SSH=\'' + ssh_cmd + '\' ' + 'git ' ;
		var working_dir = sendak_home + '/' + 'sendak' + process.pid ;
		
		// So for example:
		//   git clone https://github.com/avriette/sendak sendak -b master

		// * git clone $url $project_name -b $branch_name
		//     where $url is the repository provided as first arg to deploy_git
		//
		//     $dirname is the name of the directory you want to build in, specified with
		//     absolute path
		//
		//     $branch_name is provided as second argument to deploy_git
		
		// XXX: please change this to a join()
		var to_run = [ git_cmd, 'clone ', repo, working_dir, '-b ', branch ].join( ' ' );

		if (sendak_dry_run) {
			console.log( 'would be running: ' + to_run );
		}
		else {
			// do stuff
		} // if dry run
		
	}
	else {
		console.log( 'please check your environment for SENDAK_{IDENTITY,USER,HOME,DRY_RUN}');
		console.log( 'IDENTITY: ' + sendak_identity );
		console.log( 'USER: ' + sendak_user );
		console.log( 'HOME: ' + sendak_home );
		console.log( 'DRY RUN: ' + sendak_dry_run );
	} // if exists identity & home

} // deploy_git

deploy_git( 'https://github.com/avriette/sendak', 'master' );
