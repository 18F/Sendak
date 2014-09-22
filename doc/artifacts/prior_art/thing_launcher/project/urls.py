from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('launcher.views',
    # Examples:
    url(r'^$', 'index', name='home'),
    url(r'^flushkeys/$', 'flush_keys', name='flush_keys'),
    url(r'^PHONEHOME/(.+)/$', 'phonehome', name='phonehome'),
    url(r'^update/$', 'update', name='update'),
    url(r'^expire/$', 'expire_instances' ),
    
    url(r'^logout/$', 'logout_user', name='logout'),
    # url(r'^project/', include('project.foo.urls')),
     url(r'', include('social_auth.urls')),
    # Uncomment the admin/doc line below to enable admin documentation:
     url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
     

    # Uncomment the next line to enable the admin:
    url(r'^manage/', 'manage', name="manage"),
     
)

