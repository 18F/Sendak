from __future__ import with_statement
from fabric.api import *
from fabric.contrib.console import confirm
from cuisine import *
from tempfile import mkdtemp



def deploy_git(repo, branch):
    with settings(user='ubuntu'):
        with cd('/home/ubuntu'):
            run('git clone %s code -b %s' % (repo, branch))
        if file_exists('/home/ubuntu/code/fabfile.py'):
            temp_dir=mkdtemp()
            local("git clone %s %s -b %s" %(repo, temp_dir, branch))
            with lcd(temp_dir):
                local('fab stage -H %s' % ' '.join(env.hosts))
       
