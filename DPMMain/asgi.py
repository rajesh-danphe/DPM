"""
ASGI config for DPMMain project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/asgi/
"""
# & e:/ShivSirProject/Django/venv/Scripts/Activate.ps1 to activate venv
import os
from whitenoise import WhiteNoise
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DPMMain.settings')

application = get_asgi_application()

application = WhiteNoise(application, root='DPMAPI')
application.add_files('DPMAPI', prefix='static/')
