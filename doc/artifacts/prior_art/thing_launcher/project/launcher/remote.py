from __future__ import with_statement
from fabric.api import *
from fabric.contrib.console import confirm


import os
my_direcotry = os.path.dirname(__file__)

def deploy_git(host, repo, branch):
    with lcd(my_direcotry):
        local('fab deploy_git:%s,%s -H %s'% (repo,branch, host))
