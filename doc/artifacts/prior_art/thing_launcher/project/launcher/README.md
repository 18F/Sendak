Comments added by Jane @avriette

* `fabfile.py` &mdash; pulls code from github using `git` from the shell and subsequently runs the fab file in that directory (if it is there).

````
     def deploy_git(repo, branch):
         with settings(user='ubuntu'):
             with cd('/home/ubuntu'):
                 run('git clone %s code -b %s' % (repo, branch))
             if file_exists('/home/ubuntu/code/fabfile.py'):
                 temp_dir=mkdtemp()
                 local("git clone %s %s -b %s" %(repo, temp_dir, branch))
                 with lcd(temp_dir):
                     local('fab stage -H %s' % ' '.join(env.hosts))
 ````
 
* `ec2_launch_instance.py` &mdash; actually issues the `aws.ec2.runInstances(params)` command (via the api, not via a call out to `aws`).

* `remote.py` &mdash; uses fabric to fab a remote host.

* `models.py` &mdash; gives the user some sensible options in terms of AMIs and machine configurations.

* the `static/` directory includes non-dynamic content and no code
