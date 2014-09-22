import os, sys
os.environ["CELERY_LOADER"] = "django"

sys.path.append('/home/ubuntu/Thinglauncher/project')
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

import django.core.handlers.wsgi

application = django.core.handlers.wsgi.WSGIHandler()
