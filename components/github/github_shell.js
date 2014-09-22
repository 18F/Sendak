/* 

 Pull a github repository down with git-over-ssh

 to be eventually replaced with api calls with e.g., github-api

*/

var fs = require('fs');

// NOTE: Your environment must be equipped with these fine variables:
//
// SENDAK_USER - This is the user for github you will use to pull down repositories. Note
// that Github says that while 'bots' are generally frowned upon ('rabid lawyers', etc)
// that accounts for deployment scripts are expected and welcome.
//
// SENDAK_IDENTITY - This is an ssh key that would be created something like 
//   `ssh-keygen -t dsa -f ~/.ssh/sendak_dsa `
// or similar. Note that this refers to the private, not public key.
// 
// SENDAK_HOME - Sendak needs to live somewhere. Ordinarily this might be /home/sendak or
// in /tmp if you prefer; this is the location sendak will pull repositories down into
// before pushing them out to the new nodes.
//

var sendak_identity = process.env.SENDAK_IDENTITY ;
var sendak_user     = process.env.SENDAK_USER     ;
var sendak_home     = process.env.SENDAK_HOME     ;
var sendak_dry_run  = process.env.SENDAK_DRY_RUN  ;

// This is mostly cribbed from ThingLauncher. But we aren't using the snake, so..
//
function deploy_git( repo, branch ) {
	// XXX: Note, if "repo" here is tainted, the game is over. Don't take this from a user
	// you don't trust.
	//
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
		var to_run = git_cmd + 'clone ' + repo + ' ' + working_dir + ' -b ' + branch

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
