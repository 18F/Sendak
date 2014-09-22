from django.db import models
from django.contrib.auth.models import User
import boto
from datetime import date, timedelta
ec2 = boto.connect_ec2()

# Create your models here.


AMI_CHOICES=[('ami-bf62a9d6','Old Basic Ubuntu box 64bit'),
	     ('ami-7539b41c', 'Ubuntu 12.10 64bit',),
	     ('ami-3fec7956', 'Ubuntu 12.04 LTS 64bit'),
	     ('ami-83cf46ea', 'Ubuntu 11.10 64bit'),
		('ami-f99e2b90', 'DO NOT USE CentOS Gold Large'),
		('ami-ff9e2b96', 'DO NOT USE CentOS Gold Regular'),
            ]




class Instance(models.Model):
    created=models.DateTimeField(auto_now_add=True)
    label=models.CharField(max_length=1024)
    ami=models.CharField(max_length=255, choices=AMI_CHOICES)
    instance_id=models.CharField(max_length=1024, blank=True)
    ip_address=models.CharField(max_length=255, blank=True)
    status=models.CharField(max_length=255, blank=True)
    console_output=models.TextField(blank=True)
    ssh_key_uri=models.TextField(blank=False)
    ssh_key_name=models.CharField(max_length=1024, blank=True)
    git_uri=models.CharField(max_length=1024, blank=True)
    git_branch=models.CharField(max_length=1024, blank=True)
    user = models.ForeignKey(User)
    protected_by=models.ForeignKey(User,related_name='protector', blank=True, null=True)
    stop_after=models.DateField(default= lambda: date.today() + timedelta(days=5))
    
    
    def __unicode__(self):
        return u"[%s] %s" % (self.user, self.label)
    
    
    @property
    def inst(self):
        if self.instance_id:
            reservations=ec2.get_all_instances(instance_ids=[self.instance_id])
            return reservations[0]
            
    @property
    def actions(self):
        actions=[]
        #if self.status in ['launching', 'enqueued']: return actions
        if self.status != 'stopped':
            actions.append('stop')
            actions.append('defer auto-stop')
        else:
            actions.append('start')
            
        actions.append('destroy')
        return actions
            
        
        
        
class KeyPair(models.Model):
    user = models.ForeignKey(User)
    private_key=models.TextField(blank=False)
    public_key=models.TextField(blank=False)
    
class GithubSSH(models.Model):
    user = models.ForeignKey(User)
    json = models.TextField(blank=False)
