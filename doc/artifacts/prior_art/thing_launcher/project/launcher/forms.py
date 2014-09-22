from django import forms
from django.utils import simplejson

from models import *
import tasks
from apiclient import CFPBGitHubClient

from logging import warning


class ContactForm(forms.Form):
    
    message = forms.CharField()
    sender = forms.EmailField()
    cc_myself = forms.BooleanField(required=False)

def launcher_for_user(user):

    cached_ssh= user.githubssh_set.get_or_create()[0]
    if cached_ssh.json:
        ssh_keys=[(key['url'], key['title']) for key in simplejson.loads(cached_ssh.json)]
    else:
        client=CFPBGitHubClient(user)
        response=client.call_github_api('user/keys')
        ssh_keys=[(key['url'], key['title']) for key in simplejson.loads(response)]
        cached_ssh.json=response
        cached_ssh.save()
    
    


    
    class LauchForm(forms.Form):
        label = forms.CharField(max_length=1024)
        ami=forms.ChoiceField(choices=AMI_CHOICES,label="Base")
        ssh_key=forms.ChoiceField(choices=ssh_keys, label="SSH Key")
        git_uri=forms.CharField(max_length=1024, required=False)
        git_branch=forms.CharField(max_length=1024, required=True, initial='master')
        
        
        def save(self):
            instance=Instance(label=self.cleaned_data['label'],
                                ssh_key_uri=self.cleaned_data['ssh_key'],
                                user=user,
                                ami=self.cleaned_data['ami'],
                                git_uri=self.cleaned_data['git_uri'],
                                git_branch=self.cleaned_data['git_branch']
                            )
            instance.save()
            tasks.launch.delay(instance_record=instance)
        
        
    
    return LauchForm