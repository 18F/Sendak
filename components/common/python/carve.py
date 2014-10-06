#!/usr/bin/python
# -*- coding: <encoding name> -*-

import argparse
import psycopg2
import sys

from fabric.api import run, execute, env


def carve(args):
    '''
    Setups up new nodes based on the arguments passed.
    '''


    _create_nodes(None)
    _get_users(None)


def _get_users(args):
    '''
    Creates users
    '''
    # Get or create Users which belong to the IAM group
    # (not created yet, Python or Node)

    #If you create a user it will have an arn.
    # You can use this to search for users and create groups.
    # Save groups and users to inventory.json?
    pass


def _get_or_create_IAM_group(args):
    '''
    Get or create an IAM group (not created yet, Python or Node)
    '''
    # Get or create an IAM group (not created yet, Python or Node)
    pass

def _create_nodes(args):
    '''
    Creates nodes
    '''
    # Create EC2 instandes (nodes) by calling the shell
    # command that is already written.

    # return
    # Collect the return information from the nodes to know where
    # the node are located & dump the info in json to file.
    pass

def _get_repo(args):
    '''
    Pull down github repo for the project that should be deployed.
    '''
    #Pull down github repo for the project that should be deployed.
    pass

def _execute_repo_setup(args):
    '''
    Initates applicaiton setup based on deployment set up for repository.
    '''
    #Execute fabric script in project directory

    #This should execute the set up of the project itself, like...
    #Create groups on the machine
    #Create users on the machine
    #Setup project datastore
    #Setup project code
    # etc....

    #From project fabric script, folks can do the following.
    #from sendak import who_are_my_machines

    pass


if __name__ == "__main__":

    # Argue parser docs
    # Argument settings: http://bit.ly/1tgIbfd

    # Actions, for action=$foo in the function
    # http://bit.ly/1wEbjjo

    parser = argparse.ArgumentParser(description='The carve utility deploys servers based on the setup specified in the arguments.')

    # Project Name
    parser.add_argument('--project-name', metavar='nameofproj',
                        dest='project_name',  # default='foo',
                        help='The name of the project.')
    # Users
    parser.add_argument('--users', metavar='alice mary sue',
                        dest='users', nargs='*',  # default='foo',
                        help='List of users used for $foo purpose.')

    # Machine count
    parser.add_argument('--machine_count', metavar='3', type=int,
                        dest='machine_count', default='1',
                        help='Number of machines to deploy too.')

    args = parser.parse_args()

    # If someone didn't follow instructions and they passed
    # alice,mary,sue not alice mary sue, we parse it anyways.
    if (len(args.users) == 1) and (',' in args.users[0]):
        args.users = args.users[0].split(',')

    carve(args)

#    print args
#    print args.machine_count
#    print args.users
#    print args.project_name
