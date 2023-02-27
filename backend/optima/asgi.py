"""
ASGI config for optima project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os
import dotenv
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from app.middlewares import QueryAuthMiddleware

import app.routing

dotenv.load_dotenv(
    os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'optima.settings')

if os.getenv('DJANGO_SETTINGS_MODULE'):
    os.environ['DJANGO_SETTINGS_MODULE'] = os.getenv('DJANGO_SETTINGS_MODULE')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    'websocket': QueryAuthMiddleware(
        URLRouter(
            app.routing.ws_urlpatterns
        )
    )
})
