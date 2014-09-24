#!/usr/bin/python
# -*- coding: <encoding name> -*-

import argparse
import psycopg2
import sys

from fabric.api import run, execute, env


#TODO: Figure out how we are handling settings info
# db, user, pass

def get_users(args):
    '''
    Grab users and creds from the database
    '''

    conn = None

    try:
        conn = psycopg2.connect(database='foo', user='foo-user')
        cursor = con.cursor()
        # TODO: Rewrite to grab users
        cursor.execute('SELECT version()')
        ver = cur.fetchone()
        print ver

    except psycopg2.DatabaseError, e:
        print 'Error %s' % e
        sys.exit(1)

    finally:
        if conn:
            conn.close()

    return ver


def create_server(args):
    '''
    Creates EC2 Instances
    '''

    print(_green("Started..."))
    print(_yellow("...Creating EC2 instance..."))

    conn = boto.ec2.connect_to_region(ec2_region,
        aws_access_key_id=ec2_key, aws_secret_access_key=ec2_secret)

    image = conn.get_all_images(ec2_amis)

    reservation = image[0].run(1, 1, key_name=ec2_key_pair,
        security_groups=ec2_security,
        instance_type=ec2_instancetype)

    instance = reservation.instances[0]
    conn.create_tags([instance.id],
        {"Name": config['INSTANCE_NAME_TAG']})

    print(_green("Instance state: %s" % instance.state))
    print(_green("Public dns: %s" % instance.public_dns_name))

    return instance.public_dns_name


def create_users_on_server(args):
    '''
        Create users on aws machines
    '''
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

    print args
    print args.machine_count
    print args.users
    print args.project_name

    get_users = get_users(args)
    server = create_servers(args)
    result = create_users_on_server(args)
