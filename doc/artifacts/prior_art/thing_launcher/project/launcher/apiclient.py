from django.utils import simplejson
from urllib import urlopen, urlencode
import httplib2
h = httplib2.Http(disable_ssl_certificate_validation=True)



from urlparse import urljoin

from logging import warning

GITHUB_API_URL = 'https://github.cfpb.gov/api/v3/'



class CFPBGitHubClient(object):
    
    def __init__(self, user):
        self.user=user
        self.sa=self.user.social_auth.all()[0]
        self.token=self.sa.extra_data.get('access_token')
    
    def call_github_api(self,path, additional_params={}, method="GET"):
        
        params = {'access_token': self.token}
        params.update(additional_params)
        
        
        
        
        
        if method == "GET":
            url = urljoin(GITHUB_API_URL, path)+'?' + urlencode(params)
            resp, content = h.request(url, "GET")
            return content
        elif method == "POST":
            url = urljoin(GITHUB_API_URL, path)+'?' + urlencode(params)
            
            resp, content = h.request(url,
                                      'POST',
                                      simplejson.dumps(params),
                                      headers={'Content-Type': 'application/json'})
            warning(content)
            
            
            return content
            
            
            
            
    





    
    
