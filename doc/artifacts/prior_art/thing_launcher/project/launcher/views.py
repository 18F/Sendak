from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.shortcuts import redirect, render_to_response
from django.views.decorators.csrf import csrf_exempt

from django.template import RequestContext

from datetime import date, timedelta
import json



from apiclient import CFPBGitHubClient
from forms import launcher_for_user
from models import Instance
import tasks

from backends.cfpbgithub import CFPBGithubAuth

import social_auth.backends
social_auth.backends.BACKENDS={
    'cfpbgithub': CFPBGithubAuth,
}

import boto
from boto.exception import *

ec2=boto.connect_ec2()

# Create your views here.



@login_required
def index(request):
    
    if request.method == 'POST':
        form=launcher_for_user(request.user)(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')
        else:
            return render_to_response('index.html', locals(), context_instance=RequestContext(request))
    
    form=launcher_for_user(request.user)
    
    instances=Instance.objects.all().filter(user=request.user).exclude(status="destroyed")
    
    return render_to_response('index.html', locals(), context_instance=RequestContext(request))
    
    

    
def update(request):
    if request.method != "POST":
        return HttpResponse("this url only responds to POST requests")
        
    instance_record=Instance.objects.filter(pk=int(request.POST.get('instance'))).get()
    try:
        reservations=ec2.get_all_instances(instance_ids=[instance_record.instance_id])
    except EC2ResponseError:
        reservations=[]
    if request.POST.get(u'action')== u'destroy':
        for res in reservations:
            instances=res.instances
            for i in instances:
                    i.terminate()
        instance_record.status="destroyed"
        instance_record.save()
        
    if request.POST.get(u'action')== u'stop':
        for res in reservations:
            instances=res.instances
            for i in instances:
                    i.stop()
        instance_record.status="stopped"
        instance_record.save()
        
        
    if request.POST.get(u'action')== u'defer auto-stop':

        instance_record.stop_after=instance_record.stop_after + timedelta(days=3)
        instance_record.save()
        
    if request.POST.get(u'action')== u'start':
        for res in reservations:
            instances=res.instances
            for i in instances:
                try:
                    i.start()
                    instance_record.status="running"
                    instance_record.stop_after= date.today() + timedelta(days=5)
                    instance_record.save()
                except EC2ResponseError:
                    pass

                
    return redirect(request.POST.get(u'return', 'home'))







def manage(request):
    client= CFPBGitHubClient(request.user)
    org_json=client.call_github_api('user/orgs')
    orgs=json.loads(org_json)
    is_admin='https://github.cfpb.gov/api/v3/orgs/ThinglauncherAdmins' in [org['url'] for org in orgs ]
    if is_admin:
        
        active_servers=Instance.objects.all().filter(status__in=['launching', 'configured','configuration_failed', 'running'])
        stopped_servers=Instance.objects.all().filter(status__in=['stopped'])
        

        return render_to_response('manage-servers.html', locals(), context_instance=RequestContext(request))
    else:
        return HttpResponse("You aren't an admin")



@login_required   
def logout_user(request):
    logout(request)
    return redirect('home')
    
@login_required  
def flush_keys(request):
    if request.method=='POST':
        request.user.githubssh_set.all().delete()
    return redirect('home')


@csrf_exempt
def expire_instances(request):
    if request.method=='POST':
        tasks.expire_instances.delay()
        return HttpResponse("Will do") 
    return HttpResponse("I only respond to POST") 
    


@csrf_exempt
def phonehome(request, instance_id):
    if request.method != "POST":
        return HttpResponse("this url only responds to POST requests")
    instance_record=Instance.objects.filter(instance_id=instance_id).get()
    try:
        reservations=ec2.get_all_instances(instance_ids=[instance_record.instance_id])
    except EC2ResponseError:
        reservations=[]
    for res in reservations:
        for instance in res.instances:
            instance.add_tag('Name',"%s (%s)" %(instance_record.label,instance_record.user.username))
    instance_record.status="configuring"
    instance_record.save()
    tasks.configure_server.delay(instance_record)
    return HttpResponse("Done!")
