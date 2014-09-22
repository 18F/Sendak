from celery.decorators import task
from ec2_launch_instance import launch_instance
from django.utils import simplejson
from django.template import Context, Template, loader
from datetime import date, timedelta

import boto
from boto.exception import *

from apiclient import CFPBGitHubClient
from models import KeyPair, Instance
from sshkeys import pair

import logging


ec2 = boto.connect_ec2()

@task(name='tasks.launch')
def launch(instance_record):
    
    key_uri=instance_record.ssh_key_uri.replace('https', 'http')
    api=CFPBGitHubClient(instance_record.user)
    key_json=api.call_github_api(key_uri)
    key_data=simplejson.loads(key_json)
    aws_keypair_name=instance_record.user.username+":"+key_data['title']
    users_keypair_set=list(instance_record.user.keypair_set.all())
    if users_keypair_set:
        users_keypair=users_keypair_set[0]
    else:
        private_key, public_key=pair()
        users_keypair=KeyPair(user=instance_record.user,
                              private_key=private_key.exportKey(),
                              public_key=public_key
                              )
        users_keypair.save()
    
    pk_indent=""
    pk_lines=users_keypair.private_key.split('\n')
    for line in pk_lines:
        pk_indent += "    %s\n" % line
    
    
    config_template=loader.get_template('cloud-config.txt')
    config_context=Context({'private_key':pk_indent })
    userdata=config_template.render(config_context)
    
    api.call_github_api("user/keys", method="POST", additional_params={
    'title': "Develop from Thinglauncher",
    'key': users_keypair.public_key
    
    })

    try:
        ec2.delete_key_pair(aws_keypair_name)
    except EC2ResponseError:
        pass
    
    
    try:
        key_pair = ec2.import_key_pair(aws_keypair_name, key_data['key'])
    except EC2ResponseError:
        pass
    
    
    try:
        instance=launch_instance(ami=instance_record.ami, key_name=aws_keypair_name, user_data=userdata)
        instance_record.status='launching'
        instance_record.instance_id=instance.id
        instance_record.ip_address=instance.private_ip_address
        instance_record.ssh_key_name=key_data['title']
        instance_record.save()
    
    except EC2ResponseError:
        instance_record.status='failed'
        instance_record.save()
        
        

    
    
@task(name='tasks.configure_server')
def configure_server(instance_record):
    if instance_record.git_uri:
        from remote import deploy_git
        try:
            deploy_git(instance_record.ip_address, instance_record.git_uri, instance_record.git_branch)
            instance_record.status='configured'
            instance_record.save()
        except:
            instance_record.status='configuration_failed'
            instance_record.save()
    else:
        instance_record.status='configured'
        instance_record.save()
        
            
@task(name='tasks.expire_instances')
def expire_instances():
    expire_starting= date(year=1970, month=1, day=1)
    expire_end=date.today()
    expirable=Instance.objects.filter(protected_by__isnull=True).filter(stop_after__range=(expire_starting, expire_end)).exclude(status="destroyed").exclude(status="stopped")
    for instance_record in expirable:
        reservations=ec2.get_all_instances(instance_ids=[instance_record.instance_id])
        for res in reservations:
            instances=res.instances
            for i in instances:
                    try:
                        i.stop()
                    except EC2ResponseError:
                        pass
        instance_record.status="stopped"
        instance_record.save()
        return expirable