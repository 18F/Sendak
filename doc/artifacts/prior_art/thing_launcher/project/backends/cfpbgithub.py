"""
GitHub OAuth support (Customized for CFPB).

This contribution adds support for GitHub OAuth service. The settings
GITHUB_APP_ID and GITHUB_API_SECRET must be defined with the values
given by GitHub application registration process.

Extended permissions are supported by defining GITHUB_EXTENDED_PERMISSIONS
setting, it must be a list of values to request.

By default account id and token expiration time are stored in extra_data
field, check OAuthBackend class for details on how to extend it.
"""
import logging
logger = logging.getLogger(__name__)

import cgi
import urllib

from django.conf import settings
from django.utils import simplejson
from django.contrib.auth import authenticate

from social_auth.backends import BaseOAuth, OAuthBackend, USERNAME
from social_auth.utils import setting

# GitHub configuration
GITHUB_SERVER = 'github.cfpb.gov'
GITHUB_AUTHORIZATION_URL = 'https://%s/login/oauth/authorize' % GITHUB_SERVER
GITHUB_ACCESS_TOKEN_URL = 'https://%s/login/oauth/access_token' % GITHUB_SERVER
GITHUB_API_URL = 'https://github.cfpb.gov/api/v3'
EXPIRES_NAME = getattr(settings, 'SOCIAL_AUTH_EXPIRATION', 'expires')


class CFPBGithubBackend(OAuthBackend):
    """Github OAuth authentication backend"""
    name = 'cfpbgithub'
    EXTRA_DATA = [ ('avatar_url', 'avatar_url'),
    ('url','url'),('html_url','html_url'),('email','email'),
    ]

    def get_user_details(self, response):
        """Return user details from Github account"""
        return {USERNAME: response.get('login'),
                'email': response.get('email') or '',
                'first_name': response.get('name')}
    
    

                


class CFPBGithubAuth(BaseOAuth):
    """Github OAuth mechanism"""
    AUTH_BACKEND = CFPBGithubBackend

    def auth_url(self):
        """Returns redirect url"""
        args = {'client_id': settings.GITHUB_APP_ID,
                'redirect_uri': self.redirect_uri}
        if hasattr(settings, 'GITHUB_EXTENDED_PERMISSIONS'):
            args['scope'] = ','.join(settings.GITHUB_EXTENDED_PERMISSIONS)
        args.update(self.auth_extra_arguments())
        return GITHUB_AUTHORIZATION_URL + '?' + urllib.urlencode(args)

    def auth_complete(self, *args, **kwargs):
        """Returns user, might be logged in"""
        if 'code' in self.data:
            url = GITHUB_ACCESS_TOKEN_URL + '?' + \
                  urllib.urlencode({'client_id': settings.GITHUB_APP_ID,
                                'redirect_uri': self.redirect_uri,
                                'client_secret': settings.GITHUB_API_SECRET,
                                'code': self.data['code']})
            response = cgi.parse_qs(urllib.urlopen(url).read())
            if response.get('error'):
                error = self.data.get('error') or 'unknown error'
                raise ValueError('Authentication error: %s' % error)
            access_token = response['access_token'][0]
            data = self.user_data(access_token)
            
            if data is not None:
                if 'error' in data:
                    error = self.data.get('error') or 'unknown error'
                    raise ValueError('Authentication error: %s' % error)
                data['access_token'] = access_token
            kwargs.update({'response': data, CFPBGithubBackend.name: True})
            return authenticate(*args, **kwargs)
        else:
            error = self.data.get('error') or 'unknown error'
            raise ValueError('Authentication error: %s' % error)

    def user_data(self, access_token):
        """Loads user data from service"""
        params = {'access_token': access_token}
        url = GITHUB_API_URL + '/user?' + urllib.urlencode(params)
        
        try:
            return simplejson.load(urllib.urlopen(url))
        except ValueError:
            return None
            

            
    @classmethod
    def enabled(cls):
        """Return backend enabled status by checking basic settings"""
        return all(hasattr(settings, name) for name in
                        ('GITHUB_APP_ID',
                         'GITHUB_API_SECRET'))


# Backend definition
BACKENDS = {
    'cfpbgithub': CFPBGithubAuth,
}
